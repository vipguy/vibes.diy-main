import type { ToCloudAttachable } from '@fireproof/core-types-protocols-cloud';
import { useCallback, useEffect, useState } from 'react';
import {
  fireproof,
  ImgFile,
  toCloud as originalToCloud,
  useFireproof as originalUseFireproof,
  type Database,
  type UseFpToCloudParam,
} from 'use-fireproof';
import { ManualRedirectStrategy } from './ManualRedirectStrategy.js';

// Interface for share API response
interface ShareApiResponse {
  success: boolean;
  email: string;
  role: string;
  right: string;
  message?: string;
}

// Track sync status by database name and instance ID
const syncEnabledInstances = new Map<string, Set<string>>();

// Simple counter for generating unique instance IDs (avoids React.useId conflicts)
let instanceCounter = 0;

// Storage key for authentication token sync
const VIBES_AUTH_TOKEN_KEY = 'vibes-diy-auth-token' as const;

// Helper to update body class based on global sync status
function updateBodyClass() {
  if (typeof window === 'undefined' || !document?.body) return;

  const hasAnySyncEnabled = Array.from(syncEnabledInstances.values()).some(
    (instanceSet) => instanceSet.size > 0
  );

  if (hasAnySyncEnabled) {
    document.body.classList.add('vibes-connect-true');
  } else {
    document.body.classList.remove('vibes-connect-true');
  }
}

export { fireproof, ImgFile, ManualRedirectStrategy };

// Re-export all types under a namespace
export type * as Fireproof from 'use-fireproof';

// Helper function to create toCloud configuration with ManualRedirectStrategy
export function toCloud(opts?: UseFpToCloudParam): ToCloudAttachable {
  const attachable = originalToCloud({
    ...opts,
    strategy: new ManualRedirectStrategy(),
    dashboardURI: 'https://connect.fireproof.direct/fp/cloud/api/token-auto',
    tokenApiURI: 'https://connect.fireproof.direct/api',
    urls: { base: 'fpcloud://cloud.fireproof.direct' },
  });

  return attachable;
}

// Custom useFireproof hook with implicit cloud sync and button integration
export function useFireproof(nameOrDatabase?: string | Database) {
  // DIAGNOSTIC: Enhanced useFireproof hook entry

  // Generate unique instance ID for this hook instance (no React dependency)
  const instanceId = `instance-${++instanceCounter}`;

  // Get database name for localStorage key
  const dbName =
    typeof nameOrDatabase === 'string' ? nameOrDatabase : nameOrDatabase?.name || 'default';
  const syncKey = `fireproof-sync-${dbName}`;

  // Check if sync was previously enabled (persists across refreshes)
  const wasSyncEnabled = typeof window !== 'undefined' && localStorage.getItem(syncKey) === 'true';

  // Create attach config only if sync was previously enabled
  const attachConfig = wasSyncEnabled ? toCloud() : undefined;

  // Use original useFireproof with attach config only if previously enabled
  // This preserves the createAttach lifecycle for token persistence
  const result = originalUseFireproof(
    nameOrDatabase as string | Database | undefined,
    attachConfig ? { attach: attachConfig } : {}
  );

  // State to track manual attachment for first-time enable
  const [manualAttach, setManualAttach] = useState<
    null | 'pending' | { state: 'attached' | 'error'; attached?: unknown; error?: unknown }
  >(null);

  // Handle first-time sync enable without reload
  useEffect(() => {
    if (manualAttach === 'pending' && result.database) {
      const cloudConfig = toCloud();
      result.database
        .attach(cloudConfig)
        .then((attached) => {
          setManualAttach({ state: 'attached', attached });
          // Save preference for next refresh
          localStorage.setItem(syncKey, 'true');
        })
        .catch((error) => {
          console.error('Failed to attach:', error);
          setManualAttach({ state: 'error', error });
        });
    }
  }, [manualAttach, result.database, syncKey, dbName]);

  // Function to enable sync and trigger popup directly
  const enableSync = useCallback(() => {
    if (!wasSyncEnabled && !manualAttach) {
      // First time enabling - manual attach
      setManualAttach('pending');
    }

    // After a short delay, programmatically click the sign-in link in the overlay
    setTimeout(() => {
      const authLink = document.querySelector('.fpOverlay a[href]') as HTMLAnchorElement;
      if (authLink) {
        authLink.click();

        // Hide the overlay after clicking since we're opening the popup
        const overlay = document.querySelector('.fpOverlay') as HTMLElement;
        if (overlay) {
          overlay.style.display = 'none';
        }
      }
    }, 100); // Small delay to ensure overlay is rendered
  }, [wasSyncEnabled, manualAttach]);

  // Wire up vibes-login-link button if it exists
  useEffect(() => {
    const button = document.getElementById('vibes-login-link');
    if (!button) return;

    const handleClick = () => {
      enableSync();
    };

    button.addEventListener('click', handleClick);

    // Cleanup removes this listener on unmount
    return () => {
      button.removeEventListener('click', handleClick);
    };
  }, [enableSync]);

  // Function to disable sync
  const disableSync = useCallback(() => {
    localStorage.removeItem(syncKey);

    // Clear the authentication token for call-ai integration
    try {
      localStorage.removeItem(VIBES_AUTH_TOKEN_KEY);
    } catch {
      // Ignore localStorage errors (privacy mode, SSR, etc.)
    }

    // Reset token if attached through original flow
    if (
      result.attach?.ctx?.tokenAndClaims?.state === 'ready' &&
      result.attach.ctx.tokenAndClaims.reset
    ) {
      result.attach.ctx.tokenAndClaims.reset();
    }

    // Clear manual attach state
    setManualAttach(null);
  }, [syncKey, result.attach]);

  // Determine sync status - check for actual attachment state
  const syncEnabled =
    (wasSyncEnabled &&
      (result.attach?.state === 'attached' || result.attach?.state === 'attaching')) ||
    (manualAttach && typeof manualAttach === 'object' && manualAttach.state === 'attached');

  // Bridge Fireproof authentication to call-ai by syncing tokens to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Get the attach context (prefer result.attach over manualAttach)
    const attach = result.attach || manualAttach;

    // Check if we have a ready token state
    const hasReadyToken =
      attach &&
      typeof attach === 'object' &&
      'ctx' in attach &&
      attach.ctx?.tokenAndClaims?.state === 'ready';

    if (hasReadyToken && attach.ctx?.tokenAndClaims) {
      // Extract the token from the ready state
      const readyState = attach.ctx.tokenAndClaims;
      const tokenData = readyState.tokenAndClaims;

      if (tokenData?.token) {
        try {
          // Store the token for call-ai integration
          localStorage.setItem(VIBES_AUTH_TOKEN_KEY, tokenData.token);
          console.log(
            '[useFireproof] Synced Fireproof token to localStorage for call-ai integration'
          );
        } catch {
          // Ignore localStorage errors (privacy mode, SSR, etc.)
          console.warn(
            '[useFireproof] Failed to sync auth token to localStorage - storage may be restricted'
          );
        }
      }
    } else if (!syncEnabled) {
      // If sync is not enabled, ensure token is cleared
      try {
        const existingToken = localStorage.getItem(VIBES_AUTH_TOKEN_KEY);
        if (existingToken) {
          localStorage.removeItem(VIBES_AUTH_TOKEN_KEY);
        }
      } catch {
        // Ignore localStorage errors (privacy mode, SSR, etc.)
      }
    }
  }, [result.attach, manualAttach, syncEnabled]);

  // Share function that immediately adds a user to the ledger by email
  const share = useCallback(
    async (options: { email: string; role?: 'admin' | 'member'; right?: 'read' | 'write' }) => {
      // Get the attachment context
      const attach = result.attach || manualAttach;

      // Type guard: ensure attach is an object with ctx property
      if (
        !attach ||
        typeof attach === 'string' ||
        !('ctx' in attach) ||
        !attach.ctx?.tokenAndClaims ||
        attach.ctx.tokenAndClaims.state !== 'ready'
      ) {
        throw new Error('Authentication required. Please enable sync first.');
      }

      // Extract the token from the ready state
      // ReadyTokenAndClaimsState has: { state: "ready", tokenAndClaims: { token: string, claims?: FPCloudClaim } }
      const readyState = attach.ctx.tokenAndClaims;
      const tokenData = readyState.tokenAndClaims;

      // Create auth object matching AuthType interface: { type: "better", token: string }
      const auth = {
        type: 'clerk' as const,
        token: tokenData.token,
      };

      // Call the dashboard API (same pattern as other Fireproof dashboard requests)
      // Uses PUT method with auth in body, not headers
      const apiUrl = 'https://connect.fireproof.direct/api'; // Replace with your actual API URL

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          type: 'reqShareWithUser',
          auth: auth,
          email: options.email,
          role: options.role || 'member',
          right: options.right || 'read',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Share failed: HTTP ${response.status} ${response.statusText}: ${errorText}`
        );
      }

      const shareData = (await response.json()) as ShareApiResponse;

      // Return share result
      return {
        success: shareData.success,
        email: shareData.email,
        role: shareData.role,
        right: shareData.right,
        message: shareData.message || 'User added to ledger successfully',
      };
    },
    [dbName, result.attach, manualAttach]
  );

  // Listen for custom 'vibes-share-request' events on document
  // Any element can dispatch this event to trigger share
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleShareRequest = async (event: Event) => {
      const customEvent = event as CustomEvent<{
        email: string;
        role?: 'admin' | 'member';
        right?: 'read' | 'write';
      }>;

      const { email, role = 'member', right = 'read' } = customEvent.detail || {};

      if (!email) {
        const error = new Error('vibes-share-request requires email in event detail');
        console.error(error.message);
        document.dispatchEvent(
          new CustomEvent('vibes-share-error', {
            detail: { error, originalEvent: event },
            bubbles: true,
          })
        );
        return;
      }

      try {
        const result = await share({ email, role, right });

        // Dispatch success event
        document.dispatchEvent(
          new CustomEvent('vibes-share-success', {
            detail: { ...result, originalEvent: event },
            bubbles: true,
          })
        );
      } catch (error) {
        // Dispatch error event
        document.dispatchEvent(
          new CustomEvent('vibes-share-error', {
            detail: { error, originalEvent: event },
            bubbles: true,
          })
        );
      }
    };

    document.addEventListener('vibes-share-request', handleShareRequest);

    return () => {
      document.removeEventListener('vibes-share-request', handleShareRequest);
    };
  }, [share]);

  // Listen for custom 'vibes-sync-enable' event on document
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleSyncEnable = () => {
      enableSync();
    };

    document.addEventListener('vibes-sync-enable', handleSyncEnable);

    return () => {
      document.removeEventListener('vibes-sync-enable', handleSyncEnable);
    };
  }, [enableSync]);

  // Listen for custom 'vibes-sync-disable' event on document
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleSyncDisable = () => {
      disableSync();
    };

    document.addEventListener('vibes-sync-disable', handleSyncDisable);

    return () => {
      document.removeEventListener('vibes-sync-disable', handleSyncDisable);
    };
  }, [disableSync]);

  // Manage global sync status tracking and body class
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Ensure database entry exists in Map
    if (!syncEnabledInstances.has(dbName)) {
      syncEnabledInstances.set(dbName, new Set());
    }
    const instanceSet = syncEnabledInstances.get(dbName);
    if (!instanceSet) return;

    if (syncEnabled) {
      // Add this instance to the sync-enabled set
      instanceSet.add(instanceId);
    } else {
      // Remove this instance from the sync-enabled set
      instanceSet.delete(instanceId);
    }

    // Update body class based on global sync status
    updateBodyClass();

    // Cleanup on unmount - remove this instance
    return () => {
      const currentInstanceSet = syncEnabledInstances.get(dbName);
      if (currentInstanceSet) {
        currentInstanceSet.delete(instanceId);
        // Clean up empty sets
        if (currentInstanceSet.size === 0) {
          syncEnabledInstances.delete(dbName);
        }
        updateBodyClass();
      }
    };
  }, [syncEnabled, dbName, instanceId]);

  // Return combined result, preferring original attach over manual
  return {
    ...result,
    attach: result.attach || manualAttach,
    enableSync,
    disableSync,
    syncEnabled,
    share,
  };
}

// Re-export specific functions and types from call-ai
import { callAI } from 'call-ai';
export { callAI, callAI as callAi };

// Re-export all types under a namespace
export type * as CallAI from 'call-ai';

// Export ImgGen component - the primary export
export { default as ImgGen } from './components/ImgGen.js';
export type { ImgGenProps } from './components/ImgGen.js';

// Export all components for testing and advanced usage
export { ControlsBar } from './components/ControlsBar.js';
export { PromptBar } from './components/PromptBar.js';
export { VibesButton } from './components/VibesButton/VibesButton.js';
export { VibesSwitch } from './components/VibesSwitch/VibesSwitch.js';

// Export hooks
export { hashInput, useImageGen } from './hooks/image-gen/index.js';

// Export style utilities
export { defaultClasses } from './utils/style-utils.js';

export type { ImgGenClasses } from '@vibes.diy/use-vibes-types';

// Export utility functions
export { base64ToFile } from './utils/base64.js';

// Export ImgGen sub-components
export { ImgGenDisplay } from './components/ImgGenUtils/ImgGenDisplay.js';
export { ImgGenDisplayPlaceholder } from './components/ImgGenUtils/ImgGenDisplayPlaceholder.js';
export { ImgGenModal, type ImgGenModalProps } from './components/ImgGenUtils/ImgGenModal.js';
export { ImageOverlay } from './components/ImgGenUtils/overlays/ImageOverlay.js';

// Export internal utilities and constants
export { addNewVersion, MODULE_STATE } from './hooks/image-gen/utils.js';

// Export types for testing and advanced usage
export type {
  ImageDocument,
  PartialImageDocument,
  UseImageGenOptions,
  UseImageGenResult,
} from '@vibes.diy/use-vibes-types';

// Export useVibes hook and types
export type { UseVibesOptions, UseVibesResult, VibeDocument } from '@vibes.diy/use-vibes-types';
export { useVibes } from './hooks/vibes-gen/index.js';

// Export components for React users
export { VibeControl } from './components/VibeControl.js';
export type { VibeControlProps } from './components/VibeControl.js';

// Export HiddenMenuWrapper component and utilities
export { HiddenMenuWrapper } from './components/HiddenMenuWrapper/HiddenMenuWrapper.js';
export type { HiddenMenuWrapperProps } from './components/HiddenMenuWrapper/HiddenMenuWrapper.js';
export { hiddenMenuTheme } from './components/HiddenMenuWrapper/HiddenMenuWrapper.styles.js';
export {
  createVibeControlStyles,
  defaultVibeControlClasses,
  vibeControlTheme,
} from './utils/vibe-control-styles.js';
export type { VibeControlClasses } from './utils/vibe-control-styles.js';
// Export additional components
export { VibesPanel } from './components/VibesPanel/VibesPanel.js';
export type { VibesPanelProps } from './components/VibesPanel/VibesPanel.js';
export { AuthWall } from './components/AuthWall/AuthWall.js';
export type { AuthWallProps } from './components/AuthWall/AuthWall.js';

// Export unified mount function - the main API for non-React environments
export { mountVibesApp, mountVibesAppToBody } from './vibe-app-mount.js';
export type { MountVibesAppOptions, MountVibesAppResult } from './vibe-app-mount.js';

// Export app slug utilities
export {
  getAppSlug,
  getFullAppIdentifier,
  isDevelopmentEnvironment,
  isProductionEnvironment,
  generateRandomInstanceId,
  generateFreshDataUrl,
  generateRemixUrl,
  parseSubdomain,
  constructSubdomain,
  isValidSubdomain,
  generateInstallId,
} from './utils/appSlug.js';
export type { ParsedSubdomain } from './utils/appSlug.js';

// Export install tracking functionality
export { initVibesInstalls } from './install-tracker.js';
export type {
  Install,
  VibesInstallTrackerOptions,
  VibesInstallTrackerResult,
} from './install-tracker.js';
