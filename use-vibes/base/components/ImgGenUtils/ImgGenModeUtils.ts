import type { PartialImageDocument } from '@vibes.diy/use-vibes-types';

/**
 * Possible display modes for the ImgGen component
 */
export type ImgGenMode =
  | 'placeholder' // Initial state, no document or prompt
  | 'uploadWaiting' // Has document with uploaded files, but no prompt yet
  | 'generating' // Has prompt, is generating the image
  | 'display' // Has finished generating, displaying the result
  | 'error'; // Error state

/**
 * Pure function to determine the current mode of the ImgGen component
 * based on available document data and component state
 */
export function getImgGenMode({
  document,
  prompt,
  loading,
  error,
  debug,
}: {
  document?: PartialImageDocument | null;
  prompt?: string;
  loading: boolean;
  error?: Error;
  debug?: boolean;
}): ImgGenMode {
  if (error) {
    if (debug) console.log('[ImgGenModeUtils] Error present - error mode');
    return 'error';
  }

  // Check for prompt in document if not provided directly
  let effectivePrompt = prompt;
  if (!effectivePrompt && document) {
    // Check legacy prompt field
    if (document.prompt && typeof document.prompt === 'string') {
      effectivePrompt = document.prompt;
    }
    // Check newer structured prompts
    else if (document.prompts && document.currentPromptKey) {
      effectivePrompt = document.prompts[document.currentPromptKey]?.text;
    }
  }

  // Check if we have versions (generated images) first
  // This takes priority to ensure modal regeneration stays in display mode
  const hasVersions = !!document?.versions?.length;

  // Special case: When we have a prompt and loading, but no versions yet, show generating
  // This helps during initial generation before document is created
  // Support both direct prompt prop and document-based prompts
  if (loading && (prompt || effectivePrompt) && !hasVersions) {
    if (debug) console.log('[ImgGenModeUtils] Prompt + loading + no versions → generating');
    return 'generating';
  }

  // Priority check: Has versions - display mode
  // This ensures modal regeneration stays in display mode
  if (hasVersions) {
    if (debug) console.log('[ImgGenModeUtils] Has versions - display mode');
    return 'display';
  }

  // Check if document has input files (uploaded images waiting for prompt)
  const hasInputFiles =
    document?._files && Object.keys(document._files).some((key) => key.startsWith('in'));

  // Check if document exists but has no input files or versions
  // This usually means it's a brand new document or an error case
  const hasEmptyDoc =
    !!document && (!document._files || Object.keys(document._files).length === 0) && !hasVersions;

  if (debug) {
    console.log('[ImgGenModeUtils] Determining mode:', {
      prompt: !!prompt,
      effectivePrompt: !!effectivePrompt,
      hasVersions,
      hasInputFiles,
      hasEmptyDoc,
      loading,
    });
  }

  // Case 1: Total blank slate - no prompt, no document
  if (!document) {
    if (debug) console.log('[ImgGenModeUtils] No document - placeholder mode');
    return 'placeholder';
  }

  // Case 3: Has input files but no prompt yet - stay in upload waiting mode
  if (hasInputFiles && !effectivePrompt && !hasVersions) {
    if (debug)
      console.log('[ImgGenModeUtils] Has input files but no effective prompt - uploadWaiting mode');
    return 'uploadWaiting';
  }

  // Case 4: Has document with effective prompt but no versions yet - should generate
  if (document && effectivePrompt && !hasVersions) {
    if (debug)
      console.log('[ImgGenModeUtils] Has document + prompt but no versions - generating mode');
    return 'generating';
  }

  // Fallback - if we have an empty document or other invalid state, go back to placeholder
  if (debug) console.log('[ImgGenModeUtils] Fallback - placeholder mode');
  return 'placeholder';
}
