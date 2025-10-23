// This file exports package versions from package.json for use in the app
// Using Vite's import.meta.env to access the versions at build time

// Import the package.json using Vite's feature
import packageJson from "../../package.json" with { type: "json" };

// Extract the versions we need
const fireproofVersion = packageJson.dependencies["use-fireproof"];
const cementVersion = "latest"; // Keep this as latest or extract from package.json if added there

// Export a dependencies object ready for sandpack
export const sandpackDependencies = {
  "use-fireproof": fireproofVersion,
  "@adviser/cement": cementVersion,
};
