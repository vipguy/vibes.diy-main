import { renderHook } from "@testing-library/react";
import { useSession } from "~/vibes.diy/app/hooks/useSession.js";
import { vi, describe, it, expect, beforeEach, Mock } from "vitest";
import { VibesDiyEnv } from "~/vibes.diy/app/config/env.js";

// Mock all required dependencies
VibesDiyEnv.env().sets({
  SETTINGS_DBNAME: "test-chat-history",
});

vi.mock("use-fireproof", async (original) => {
  const originalModule = (await original()) as typeof import("use-fireproof");
  // const mockFireproof = vi.fn().mockImplementation(() => {
  //   console.log("Mock fireproof called");
  // });
  const mockSubmitUserMessage = vi.fn().mockResolvedValue({ ok: true });
  const id = Math.random().toString(36).substring(2, 15);
  const mockUseFireproof = vi.fn().mockImplementation((name) => {
    // console.log("Mock fireproof called", name);
    if (!name) {
      console.trace("missing name");
      throw new Error("missing NAME");
    }
    return {
      id,
      useDocument: () => ({
        doc: { _id: "test-id", type: "user" },
        merge: vi.fn(),
        submit: mockSubmitUserMessage,
        save: vi.fn(),
      }),
      useLiveQuery: () => ({ docs: [] }),
      database: { get: vi.fn(), put: vi.fn() },
    } as unknown as ReturnType<typeof useFireproof>;
  });
  return {
    ...originalModule,
    // fireproof: mockFireproof,
    useFireproof: mockUseFireproof,
  };
});

// vi.mock("~/vibes.diy/app/utils/databaseManager.js", () => ({
//   getSessionDatabaseName: vi
//     .fn()
//     .mockImplementation((id) => `vibe-${id || "default"}`),
// }));

import { useFireproof } from "use-fireproof";

// Tests focused on eager database initialization behavior
describe("useSession", () => {
  let mockUseFireproof: Mock<typeof useFireproof>;

  beforeEach(() => {
    globalThis.document.body.innerHTML = "";
    mockUseFireproof = vi.mocked(useFireproof);
    mockUseFireproof.mockClear();
    vi.clearAllMocks();
  });

  it("should initialize database eagerly with provided sessionId", async () => {
    renderHook(() => useSession("test-id"));
    expect(mockUseFireproof).toHaveBeenCalledWith("vibe-test-id");
    expect(mockUseFireproof.mock.calls.length).toBe(2);
  });
});
