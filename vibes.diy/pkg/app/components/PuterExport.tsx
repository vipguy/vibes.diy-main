import React, { useState, useEffect } from 'react';
import {
  isPuterSignedIn,
  getPuterUser,
  signInToPuter,
  signOutFromPuter,
  deployToPuter,
  listPuterSites,
  loadPuterSDK,
  generateDeploymentFiles,
  type PuterUser,
  type PuterSite,
} from '../utils/puterIntegration.js';

interface PuterExportProps {
  html: string;
  sessionId?: string;
  title?: string;
  onClose: () => void;
}

export function PuterExport({ html, sessionId, title, onClose }: PuterExportProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<PuterUser | null>(null);
  const [subdomain, setSubdomain] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedSite, setDeployedSite] = useState<PuterSite | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [existingSites, setExistingSites] = useState<PuterSite[]>([]);
  const [existingMetadata, setExistingMetadata] = useState<any>(null);

  useEffect(() => {
    initializePuter();
  }, []);

  async function initializePuter() {
    try {
      await loadPuterSDK();
      const signedIn = isPuterSignedIn();
      setIsSignedIn(signedIn);

      if (signedIn) {
        const userData = await getPuterUser();
        setUser(userData);
        const sites = await listPuterSites();
        setExistingSites(sites);
      }
    } catch (err) {
      console.error('Failed to initialize Puter:', err);
      setError('Failed to load Puter SDK');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignIn() {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await signInToPuter();
      setUser(userData);
      setIsSignedIn(true);
      const sites = await listPuterSites();
      setExistingSites(sites);
    } catch (err) {
      console.error('Sign in failed:', err);
      setError('Failed to sign in to Puter');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignOut() {
    setIsLoading(true);
    try {
      await signOutFromPuter();
      setUser(null);
      setIsSignedIn(false);
      setExistingSites([]);
      setDeployedSite(null);
    } catch (err) {
      console.error('Sign out failed:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeploy() {
    if (!subdomain.trim()) {
      setError('Please enter a subdomain name');
      return;
    }

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9-]+$/;
    if (!subdomainRegex.test(subdomain)) {
      setError('Subdomain can only contain lowercase letters, numbers, and hyphens');
      return;
    }

    setIsDeploying(true);
    setError(null);

    try {
      const files = generateDeploymentFiles(html);
      const site = await deployToPuter(subdomain, files, {
        sessionId,
        title,
      });
      
      // Ensure URL is set, construct it if not provided
      if (!site.url) {
        site.url = `https://${subdomain}.puter.site`;
      }
      
      console.log('Deployed site:', site);
      setDeployedSite(site);
      
      // Refresh sites list
      const sites = await listPuterSites();
      setExistingSites(sites);
    } catch (err: any) {
      console.error('Deployment failed:', err);
      setError(err.message || 'Failed to deploy to Puter');
    } finally {
      setIsDeploying(false);
    }
  }

  async function handleSubdomainSelect(selectedSubdomain: string) {
    setSubdomain(selectedSubdomain);
    
    // Load metadata for this subdomain
    const metadata = await import('../utils/puterIntegration.js').then(m => 
      m.getProjectMetadata(selectedSubdomain)
    );
    setExistingMetadata(metadata);
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading Puter...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Export to Puter Hosting
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {!isSignedIn ? (
            /* Sign In View */
            <div className="text-center">
              <div className="mb-6">
                <svg className="w-20 h-20 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Sign in to Puter
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Deploy your app to Puter's free hosting platform. Get a custom subdomain and instant deployment.
              </p>
              <button
                onClick={handleSignIn}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                Sign in with Puter
              </button>
            </div>
          ) : (
            /* Deployment View */
            <div>
              {/* User Info */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Signed in as</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{user?.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Deployment Form */}
              {!deployedSite ? (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Choose a subdomain
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={subdomain}
                        onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
                        placeholder="my-awesome-app"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="text-gray-600 dark:text-gray-400">.puter.site</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Only lowercase letters, numbers, and hyphens allowed
                    </p>
                  </div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  {existingSites.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your existing sites:
                      </p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {existingSites.map((site) => (
                          <div
                            key={site.uid}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 cursor-pointer"
                            onClick={() => handleSubdomainSelect(site.subdomain)}
                          >
                            {site.subdomain}.puter.site
                          </div>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Click to update an existing site
                      </p>
                    </div>
                  )}

                  {existingMetadata && (
                    <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                        ⚠️ Updating Existing Site
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">
                        Last deployed: {new Date(existingMetadata.deployedAt).toLocaleString()}
                      </p>
                      {existingMetadata.title && (
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">
                          Title: {existingMetadata.title}
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleDeploy}
                    disabled={isDeploying || !subdomain.trim()}
                    className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    {isDeploying 
                      ? (existingMetadata ? 'Updating...' : 'Deploying...') 
                      : (existingMetadata ? 'Update Site' : 'Deploy to Puter')
                    }
                  </button>
                </div>
              ) : (
                /* Success View */
                <div className="text-center">
                  <div className="mb-6">
                    <svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {existingMetadata ? 'Update Successful!' : 'Deployment Successful!'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Your app is now live at:
                  </p>
                  <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <a
                      href={deployedSite.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-mono text-blue-500 hover:text-blue-600 break-all"
                    >
                      {deployedSite.url}
                    </a>
                  </div>
                  <a
                    href={deployedSite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors mb-4"
                  >
                    Open Site →
                  </a>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => {
                        setDeployedSite(null);
                        setSubdomain('');
                      }}
                      className="px-4 py-2 text-blue-500 hover:text-blue-600"
                    >
                      Deploy Another
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
