import * as React from 'react';
import { combineClasses, defaultClasses, ImgGenClasses } from '../utils/style-utils.js';
import { imgGenStyles } from '../utils/styles.js';

interface PromptBarProps {
  readonly promptText: string;
  readonly editedPrompt: string | null; // null means not in edit mode

  readonly setEditedPrompt: (prompt: string | null) => void; // Set to null to exit edit mode

  readonly handlePromptEdit: (prompt: string) => void;
  /** Custom CSS classes for styling component parts */
  readonly classes?: Partial<ImgGenClasses>;
}

/**
 * PromptBar component - Displays and allows editing of the prompt text
 */
export function PromptBar({
  promptText,
  editedPrompt,
  setEditedPrompt,
  handlePromptEdit,
  classes = defaultClasses,
}: PromptBarProps) {
  return (
    <div style={imgGenStyles.topLine}>
      <div className={combineClasses(classes.prompt)} style={imgGenStyles.prompt}>
        {editedPrompt !== null ? (
          <input
            type="text"
            value={editedPrompt}
            onChange={(e) => setEditedPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handlePromptEdit(editedPrompt);
              } else if (e.key === 'Escape') {
                setEditedPrompt(null); // Exit edit mode
              }
            }}
            // Removed onBlur handler to prevent edit mode from being exited when clicking buttons
            autoFocus
            style={{
              ...imgGenStyles.promptInput,
              ...imgGenStyles.promptInputEditMode,
            }}
            aria-label="Edit prompt"
          />
        ) : (
          <div
            className="imggen-prompt-text"
            onClick={() => {
              // Enter edit mode on single click
              setEditedPrompt(promptText);
            }}
            style={{
              ...imgGenStyles.promptText,
              ...imgGenStyles.truncate,
            }}
            title="Click to edit prompt"
          >
            {promptText}
          </div>
        )}
      </div>
    </div>
  );
}
