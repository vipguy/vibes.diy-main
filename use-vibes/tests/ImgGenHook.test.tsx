import React, { useState } from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ImgGen } from '@vibes.diy/use-vibes-base';

// Define mock modules first (these are hoisted to the top by Vitest)
vi.mock('call-ai', () => {
  return {
    imageGen: vi.fn().mockImplementation((_prompt, _options) => {
      return Promise.resolve({
        created: Date.now(),
        data: [
          {
            b64_json: 'mockBase64Image',
            url: null,
            revised_prompt: 'Generated test image',
          },
        ],
      });
    }),
    callAI: vi.fn(),
    joinUrlParts: vi.fn((base: string, path: string) => {
      if (!base || !path) return base || path || '';
      const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      return `${cleanBase}/${cleanPath}`;
    }),
  };
});

// Mock Fireproof
vi.mock('use-vibes', (actual) => {
  const mockDb = {
    get: vi.fn().mockImplementation(async (id) => {
      // Return a basic document structure for any ID to avoid "Not found" errors
      return {
        _id: id,
        type: 'image',
        created: Date.now(),
        prompt: 'Test prompt',
        currentVersion: 0,
        currentPromptKey: 'p1',
        versions: [{ id: 'v1', created: Date.now(), promptKey: 'p1' }],
        prompts: { p1: { text: 'Test prompt', created: Date.now() } },
        _files: { v1: new File(['test'], 'test.png', { type: 'image/png' }) },
      };
    }),
    put: vi.fn().mockResolvedValue({ ok: true, id: 'test-id', rev: 'test-rev' }),
    del: vi.fn().mockResolvedValue({ ok: true }),
    query: vi.fn().mockResolvedValue({ rows: [] }),
    remove: vi.fn().mockResolvedValue({ ok: true }),
  };

  return {
    ...actual,
    useFireproof: () => ({ database: mockDb }),
    ImgFile: ({ alt }: { alt?: string }) => <div data-testid="mock-img">{alt}</div>,
  };
});

// Import the mocked module after the vi.mock calls
import { imageGen } from 'call-ai';

// Cast the imported mocked function to include Vi mock methods
const mockImageGen = imageGen as unknown as ReturnType<typeof vi.fn>;

// Track the number of fetch calls across renders
describe('ImgGen Render Test', () => {
  beforeEach(() => {
    mockImageGen.mockClear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not trigger duplicate image generation requests', async () => {
    // Wrap in act to handle useEffect and state updates
    await act(async () => {
      render(<ImgGen prompt="test image" />);
    });

    // Wait for any async effects to complete using waitFor
    await waitFor(
      () => {
        expect(mockImageGen).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );

    // Check how many times imageGen was called

    // This should be 1, but the bug might show 2 or more
    expect(mockImageGen).toHaveBeenCalledTimes(1);
  });

  it('should only generate new image when props change', async () => {
    // Test component that can change props
    function TestWrapper() {
      const [prompt, setPrompt] = useState('initial prompt');

      return (
        <div>
          <ImgGen prompt={prompt} />
          <button data-testid="change-prompt" onClick={() => setPrompt('new prompt')}>
            Change Prompt
          </button>
        </div>
      );
    }

    await act(async () => {
      render(<TestWrapper />);
    });

    // Wait for initial render to complete
    await waitFor(
      () => {
        expect(mockImageGen).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );

    // Check initial calls
    const initialCalls = mockImageGen.mock.calls.length;

    // Change the prompt
    await act(async () => {
      fireEvent.click(screen.getByTestId('change-prompt'));
    });

    // Wait for effects to run
    await waitFor(
      () => {
        expect(mockImageGen.mock.calls.length).toBeGreaterThan(initialCalls);
      },
      { timeout: 1000 }
    );

    // Should only have one additional call
    const finalCalls = mockImageGen.mock.calls.length;

    // We expect exactly one more call
    expect(finalCalls).toBe(initialCalls + 1);
  });
});
