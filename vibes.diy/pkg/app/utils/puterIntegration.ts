/**
 * Puter.js Integration Utilities
 * Handles authentication and hosting deployment to Puter
 */

declare global {
  interface Window {
    puter: any;
  }
}

export interface PuterUser {
  username: string;
  email: string;
  uid: string;
  created_at: string;
  is_verified: boolean;
}

export interface PuterSite {
  subdomain: string;
  uid: string;
  url: string;
  dir_path?: string;
  created_at: string;
}

/**
 * Check if Puter.js is loaded
 */
export function isPuterLoaded(): boolean {
  return typeof window !== 'undefined' && typeof window.puter !== 'undefined';
}

/**
 * Load Puter.js SDK dynamically
 */
export async function loadPuterSDK(): Promise<void> {
  if (isPuterLoaded()) {
    return;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js.puter.com/v2/';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Puter.js SDK'));
    document.head.appendChild(script);
  });
}

/**
 * Check if user is signed in to Puter
 */
export function isPuterSignedIn(): boolean {
  if (!isPuterLoaded()) return false;
  return window.puter.auth.isSignedIn();
}

/**
 * Get current Puter user
 */
export async function getPuterUser(): Promise<PuterUser | null> {
  if (!isPuterLoaded() || !isPuterSignedIn()) {
    return null;
  }

  try {
    const user = await window.puter.auth.getUser();
    return user;
  } catch (error) {
    console.error('Failed to get Puter user:', error);
    return null;
  }
}

/**
 * Sign in to Puter
 */
export async function signInToPuter(): Promise<PuterUser> {
  await loadPuterSDK();
  
  await window.puter.auth.signIn();
  
  const user = await window.puter.auth.getUser();
  return user;
}

/**
 * Sign out from Puter
 */
export async function signOutFromPuter(): Promise<void> {
  if (!isPuterLoaded()) return;
  
  await window.puter.auth.signOut();
}

/**
 * Deploy app to Puter hosting
 */
export async function deployToPuter(
  subdomain: string,
  files: { path: string; content: string }[]
): Promise<PuterSite> {
  if (!isPuterLoaded() || !isPuterSignedIn()) {
    throw new Error('Must be signed in to Puter to deploy');
  }

  try {
    // Create a directory for the site
    const dirName = `vibes-${subdomain}-${Date.now()}`;
    await window.puter.fs.mkdir(dirName);

    // Write all files to the directory
    for (const file of files) {
      const filePath = `${dirName}/${file.path}`;
      await window.puter.fs.write(filePath, file.content);
    }

    // Create or update the hosting deployment
    let site: PuterSite;
    try {
      // Try to get existing site
      site = await window.puter.hosting.get(subdomain);
      // Update existing site
      await window.puter.hosting.update(subdomain, dirName);
      site = await window.puter.hosting.get(subdomain);
    } catch {
      // Create new site if it doesn't exist
      site = await window.puter.hosting.create(subdomain, dirName);
    }

    return site;
  } catch (error) {
    console.error('Failed to deploy to Puter:', error);
    throw error;
  }
}

/**
 * List all Puter hosted sites
 */
export async function listPuterSites(): Promise<PuterSite[]> {
  if (!isPuterLoaded() || !isPuterSignedIn()) {
    return [];
  }

  try {
    const sites = await window.puter.hosting.list();
    return sites;
  } catch (error) {
    console.error('Failed to list Puter sites:', error);
    return [];
  }
}

/**
 * Delete a Puter hosted site
 */
export async function deletePuterSite(subdomain: string): Promise<void> {
  if (!isPuterLoaded() || !isPuterSignedIn()) {
    throw new Error('Must be signed in to Puter to delete sites');
  }

  await window.puter.hosting.delete(subdomain);
}

/**
 * Generate files for deployment from app HTML
 */
export function generateDeploymentFiles(html: string): { path: string; content: string }[] {
  return [
    {
      path: 'index.html',
      content: html,
    },
  ];
}
