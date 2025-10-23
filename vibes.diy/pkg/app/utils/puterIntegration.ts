/**
 * Puter.js Integration Utilities
 * Handles authentication and hosting deployment to Puter
 */

import {
  normalizeComponentExports,
  transformImports,
} from '@vibes.diy/prompts';

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

export interface ProjectMetadata {
  subdomain: string;
  sessionId?: string;
  title?: string;
  html: string;
  deployedAt: string;
  updatedAt: string;
  dirName: string;
}

/**
 * Save project metadata to Puter KV store
 */
export async function saveProjectMetadata(
  subdomain: string,
  metadata: Omit<ProjectMetadata, 'subdomain'>
): Promise<void> {
  if (!isPuterLoaded() || !isPuterSignedIn()) {
    throw new Error('Must be signed in to Puter to save metadata');
  }

  const projectData: ProjectMetadata = {
    subdomain,
    ...metadata,
  };

  const key = `vibes-project-${subdomain}`;
  await window.puter.kv.set(key, JSON.stringify(projectData));
}

/**
 * Get project metadata from Puter KV store
 */
export async function getProjectMetadata(subdomain: string): Promise<ProjectMetadata | null> {
  if (!isPuterLoaded() || !isPuterSignedIn()) {
    return null;
  }

  try {
    const key = `vibes-project-${subdomain}`;
    const data = await window.puter.kv.get(key);
    
    if (!data) return null;
    
    return JSON.parse(data) as ProjectMetadata;
  } catch (error) {
    console.error('Failed to get project metadata:', error);
    return null;
  }
}

/**
 * List all saved projects
 */
export async function listSavedProjects(): Promise<ProjectMetadata[]> {
  if (!isPuterLoaded() || !isPuterSignedIn()) {
    return [];
  }

  try {
    const keys = await window.puter.kv.list();
    const projectKeys = keys.filter((key: string) => key.startsWith('vibes-project-'));
    
    const projects: ProjectMetadata[] = [];
    for (const key of projectKeys) {
      const data = await window.puter.kv.get(key);
      if (data) {
        projects.push(JSON.parse(data));
      }
    }
    
    return projects.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (error) {
    console.error('Failed to list saved projects:', error);
    return [];
  }
}

/**
 * Delete project metadata
 */
export async function deleteProjectMetadata(subdomain: string): Promise<void> {
  if (!isPuterLoaded() || !isPuterSignedIn()) {
    throw new Error('Must be signed in to Puter to delete metadata');
  }

  const key = `vibes-project-${subdomain}`;
  await window.puter.kv.del(key);
}

/**
 * Deploy app to Puter hosting
 */
export async function deployToPuter(
  subdomain: string,
  files: { path: string; content: string }[],
  metadata?: {
    sessionId?: string;
    title?: string;
  }
): Promise<PuterSite> {
  if (!isPuterLoaded() || !isPuterSignedIn()) {
    throw new Error('Must be signed in to Puter to deploy');
  }

  try {
    const now = new Date().toISOString();
    let dirName: string;
    let isUpdate = false;

    // Check if this is an update to an existing project
    const existingMetadata = await getProjectMetadata(subdomain);
    
    if (existingMetadata) {
      // Update existing project - reuse the same directory
      dirName = existingMetadata.dirName;
      isUpdate = true;
    } else {
      // New project - create new directory
      dirName = `vibes-${subdomain}-${Date.now()}`;
      await window.puter.fs.mkdir(dirName);
    }

    // Write all files to the directory (overwrites existing files)
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

    // Save project metadata
    await saveProjectMetadata(subdomain, {
      sessionId: metadata?.sessionId,
      title: metadata?.title,
      html: files.find(f => f.path === 'index.html')?.content || '',
      deployedAt: existingMetadata?.deployedAt || now,
      updatedAt: now,
      dirName,
    });

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
 * Generate files for deployment from React component code
 * Creates a self-contained HTML file with all dependencies via import maps
 */
export function generateDeploymentFiles(reactCode: string): { path: string; content: string }[] {
  // First normalize the component to ensure it's named App and has proper exports
  const normalized = normalizeComponentExports(reactCode);
  const transformed = transformImports(normalized);
  
  // Create a self-contained HTML file with import maps and Babel
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vibes DIY App</title>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow-x: hidden;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    #root {
      width: 100%;
      min-height: 100%;
    }
    .error-container {
      padding: 20px;
      color: #dc2626;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      margin: 20px;
      font-family: monospace;
      white-space: pre-wrap;
    }
    .primalcore-badge {
      position: fixed;
      bottom: 16px;
      right: 16px;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
      z-index: 999999;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.2s ease;
      text-decoration: none;
      pointer-events: auto;
      cursor: pointer;
      width: fit-content;
      max-width: 200px;
    }
    .primalcore-badge:hover {
      background: rgba(0, 0, 0, 0.9);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
    .primalcore-badge svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
    @media (max-width: 640px) {
      .primalcore-badge {
        bottom: 12px;
        right: 12px;
        padding: 6px 12px;
        font-size: 11px;
      }
      .primalcore-badge svg {
        width: 14px;
        height: 14px;
      }
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <a href="https://github.com/vipguy/vibes.diy-main" target="_blank" rel="noopener noreferrer" class="primalcore-badge">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
      <path d="M2 17l10 5 10-5"></path>
      <path d="M2 12l10 5 10-5"></path>
    </svg>
    <span>Made by Primalcore</span>
  </a>
  <script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@19.2.0",
      "react-dom": "https://esm.sh/react-dom@19.2.0",
      "react-dom/client": "https://esm.sh/react-dom@19.2.0/client",
      "use-fireproof": "https://esm.sh/use-fireproof@0.23.11?external=react,react-dom",
      "call-ai": "https://esm.sh/call-ai",
      "use-vibes": "https://esm.sh/use-vibes",
      "three": "https://esm.sh/three"
    }
  }
  </script>
  <script type="text/babel" data-type="module">
    import ReactDOMClient from 'react-dom/client';

    // prettier-ignore
    ${transformed}
    // prettier-ignore-end

    // Render the app
    const rootElement = document.getElementById('root');
    const root = ReactDOMClient.createRoot(rootElement);
    root.render(<App />);
  </script>
  <script>
    // Error handling
    window.addEventListener('error', (event) => {
      console.error('Runtime error:', event.error);
      const root = document.getElementById('root');
      if (root && !root.hasChildNodes()) {
        root.innerHTML = 
          '<div class="error-container">' +
          '<strong>Error loading app:</strong>\\n' +
          (event.error?.message || event.message) +
          '</div>';
      }
    });
  </script>
</body>
</html>`;

  return [
    {
      path: 'index.html',
      content: html,
    },
  ];
}
