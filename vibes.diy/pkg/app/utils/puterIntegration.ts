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
 * Uses the same approach as vibesbox.dev hosting
 */
export function generateDeploymentFiles(reactCode: string): { path: string; content: string }[] {
  // Import the transformation function from prompts package
  // This is the same transformation used by the regular publish flow
  const { normalizeComponentExports } = require('@vibes.diy/prompts');
  
  // Transform the code to use ESM imports from esm.sh
  const transformedCode = normalizeComponentExports(reactCode);
  
  // Create a standalone HTML file similar to vibesbox.dev
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vibes DIY App</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      width: 100%;
      height: 100vh;
      overflow: hidden;
    }
    #root {
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    ${transformedCode}
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
