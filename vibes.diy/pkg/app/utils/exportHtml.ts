import { VibesDiyEnv } from "../config/env.js";
import iframeTemplateRaw from "../components/ResultPreview/templates/iframe-template.html?raw";
import {
  normalizeComponentExports,
  transformImports,
} from "@vibes.diy/prompts";

/**
 * Remove React imports since we're using UMD builds
 */
function removeReactImports(code: string): string {
  return code
    .replace(/import\s+React(?:\s*,\s*\{[^}]*\})?\s+from\s+['"]react['"]\s*;?\n?/g, '')
    .replace(/import\s+\{([^}]+)\}\s+from\s+['"]react['"]\s*;?\n?/g, '')
    .replace(/import\s+\*\s+as\s+React\s+from\s+['"]react['"]\s*;?\n?/g, '')
    .replace(/import\s+.*from\s+['"]react-dom['"]\s*;?\n?/g, '')
    .replace(/import\s+.*from\s+['"]react-dom\/client['"]\s*;?\n?/g, '');
}

export function generateStandaloneHtml(params: { code: string }): string {
  const normalized = normalizeComponentExports(params.code);
  const withoutReactImports = removeReactImports(normalized);
  const transformed = transformImports(withoutReactImports);

  return iframeTemplateRaw
    .replaceAll("{{API_KEY}}", "sk-vibes-proxy-managed")
    .replaceAll("{{CALLAI_ENDPOINT}}", VibesDiyEnv.CALLAI_ENDPOINT())
    .replace("{{APP_CODE}}", transformed);
}

export function downloadTextFile(
  filename: string,
  contents: string,
  type = "text/html",
): void {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
