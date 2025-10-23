import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  MockInstance,
  vi,
} from "vitest";
import {
  generateStandaloneHtml,
  downloadTextFile,
} from "~/vibes.diy/app/utils/exportHtml.js";
import iframeTemplateRaw from "~/vibes.diy/app/components/ResultPreview/templates/iframe-template.html?raw";

describe("exportHtml utilities", () => {
  describe("generateStandaloneHtml", () => {
    it("injects code and environment tokens into the iframe template", () => {
      // Sanity-check: the raw template has the placeholders we expect to replace
      expect(iframeTemplateRaw).toContain("{{APP_CODE}}");
      expect(iframeTemplateRaw).toContain("{{CALLAI_ENDPOINT}}");
      expect(iframeTemplateRaw).toContain("{{API_KEY}}");
      // SESSION_ID placeholder no longer exists in template
      expect(iframeTemplateRaw).not.toContain("{{SESSION_ID}}");
      expect(iframeTemplateRaw).not.toContain("window.SESSION_ID");

      const code = "const a = 1;";
      const sessionId = "my-session-123"; // Keep this to test that it doesn't appear in output

      const html = generateStandaloneHtml({ code });

      // Code should be present and the placeholders should be gone
      expect(html).toContain(code);
      expect(html).not.toContain("{{APP_CODE}}");

      // Session id should not appear anywhere in the exported HTML
      expect(html).not.toContain("SESSION_ID");
      expect(html).not.toContain(sessionId);

      // Environment tokens should be replaced with values from env.ts fallbacks
      const expectedEndpoint = "https://vibes-diy-api.com/"; // API_BASE_URL default with trailing slash, used by CALLAI_ENDPOINT fallback
      expect(html).toContain(`window.CALLAI_CHAT_URL = "${expectedEndpoint}"`);
      expect(html).toContain(`window.CALLAI_IMG_URL = "${expectedEndpoint}"`);
      expect(html).not.toContain("{{CALLAI_ENDPOINT}}");

      // API key token is replaced by a managed proxy key literal
      expect(html).toContain(
        `window.CALLAI_API_KEY = "sk-vibes-proxy-managed"`,
      );
      expect(html).not.toContain("{{API_KEY}}");
    });

    it("ignores sessionId parameter even when provided", () => {
      const code = "const a = 1;";
      const html = generateStandaloneHtml({ code });

      // SESSION_ID should not appear in the HTML at all
      expect(html).not.toContain("SESSION_ID");
      expect(html).not.toContain("{{SESSION_ID}}");
    });
  });

  describe("downloadTextFile", () => {
    const realCreateObjectURL = URL.createObjectURL;
    const realRevokeObjectURL = URL.revokeObjectURL;
    const realCreateElement = document.createElement;

    let blobUrl: string;
    let anchorEl: HTMLAnchorElement;
    let clickSpy: MockInstance<() => void>;
    let appendSpy: MockInstance<<T extends Node>(node: T) => T>;

    beforeEach(() => {
      blobUrl = "blob:http://localhost/mock-blob-url";
      URL.createObjectURL = vi.fn().mockReturnValue(blobUrl);
      URL.revokeObjectURL = vi.fn();

      // Prepare an <a> element we can observe
      anchorEl = realCreateElement.call(document, "a") as HTMLAnchorElement;
      clickSpy = vi.spyOn(anchorEl, "click").mockImplementation(() => {
        /* no-op */
      });

      // Spy on appendChild to verify the element was appended
      appendSpy = vi.spyOn(document.body, "appendChild");

      // Spy on document.createElement to return our prepared <a>
      vi.spyOn(document, "createElement").mockImplementation(((
        tagName: string,
        options?: ElementCreationOptions,
      ) => {
        if (tagName.toLowerCase() === "a") return anchorEl as HTMLAnchorElement;
        // fallback to the real implementation for everything else
        return realCreateElement.call(document, tagName, options);
      }) as typeof document.createElement);
    });

    afterEach(() => {
      vi.restoreAllMocks();
      URL.createObjectURL = realCreateObjectURL;
      URL.revokeObjectURL = realRevokeObjectURL;
      // No need to restore createElement explicitly because restoreAllMocks handles it
      // Ensure test DOM is clean
      document.body.innerHTML = "";
    });

    it("creates a Blob URL, downloads via a temporary <a>, then cleans up", () => {
      const filename = "test-export.html";
      const contents = "<html><body>test</body></html>";

      downloadTextFile(filename, contents);

      // Assert object URL creation and assignment to anchor href
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(anchorEl.href).toBe(blobUrl);

      // Assert download attribute is set
      expect(anchorEl.download).toBe(filename);

      // Assert it was appended, clicked, and removed
      expect(appendSpy).toHaveBeenCalledWith(anchorEl);
      expect(clickSpy).toHaveBeenCalledTimes(1);
      expect(anchorEl.isConnected).toBe(false); // removed from DOM

      // Assert cleanup of the Blob URL
      expect(URL.revokeObjectURL).toHaveBeenCalledWith(blobUrl);
    });
  });
});
