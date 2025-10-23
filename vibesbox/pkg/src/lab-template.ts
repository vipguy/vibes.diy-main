export const labHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lab: {{slug}} - Vibesbox</title>
    <meta
      name="description"
      content="Test lab for {{slug}} - multi-iframe isolation testing"
    />

    <style>
      * {
        box-sizing: border-box;
      }

      body,
      html {
        margin: 0;
        padding: 0;
        height: 100%;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: #f5f5f5;
      }

      .container {
        display: flex;
        flex-direction: column;
        height: 100vh;
      }

      .control-panel {
        background: white;
        border-bottom: 1px solid #e0e0e0;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
      }

      .control-group {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .control-group label {
        font-weight: 500;
        color: #333;
        min-width: 80px;
      }

      .control-group input,
      .control-group select,
      .control-group button {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }

      .control-group button {
        background: #1976d2;
        color: white;
        cursor: pointer;
        border: none;
      }

      .control-group button:hover {
        background: #1565c0;
      }

      .control-group button:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      .status {
        font-size: 12px;
        color: #666;
        padding: 4px 8px;
        border-radius: 12px;
        background: #f0f0f0;
      }

      .status.loading {
        background: #fff3cd;
        color: #856404;
      }

      .status.ready {
        background: #d4edda;
        color: #155724;
      }

      .status.error {
        background: #f8d7da;
        color: #721c24;
      }

      .iframe-grid {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 2px;
        background: #ddd;
        padding: 2px;
      }

      .iframe-container {
        background: white;
        display: flex;
        flex-direction: column;
        position: relative;
      }

      .iframe-header {
        background: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
        padding: 8px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        font-weight: 500;
      }

      .frame-controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .reload-btn {
        padding: 2px 6px;
        font-size: 14px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: #fff;
        color: #666;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .reload-btn:hover {
        background: #f0f0f0;
        color: #333;
      }

      .reload-btn:disabled {
        background: #f8f9fa;
        color: #ccc;
        cursor: not-allowed;
      }

      .iframe-content {
        flex: 1;
        position: relative;
      }

      .iframe-content iframe {
        width: 100%;
        height: 100%;
        border: none;
      }

      .iframe-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: #666;
      }

      .session-info {
        font-family: monospace;
        font-size: 12px;
        color: #666;
        background: #f8f9fa;
        padding: 4px 8px;
        border-radius: 4px;
      }

      .help-text {
        font-size: 12px;
        color: #888;
        font-style: italic;
        margin-left: 8px;
      }

      @media (max-width: 768px) {
        .iframe-grid {
          grid-template-columns: 1fr;
          grid-template-rows: repeat(4, 1fr);
        }

        .control-panel {
          flex-direction: column;
          align-items: stretch;
        }

        .control-group {
          justify-content: space-between;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="control-panel">
        <div class="control-group">
          <label>Vibe:</label>
          <input
            type="text"
            id="vibeSlug"
            value="{{slug}}"
            placeholder="quick-cello-8104"
          />
        </div>

        <div class="control-group">
          <label>Session:</label>
          <select id="sessionSelect">
            <option value="">Generate New Session</option>
          </select>
        </div>

        <div class="control-group">
          <label>v_fp:</label>
          <input type="text" id="fireproofVersion" placeholder="0.23.6" />
        </div>

        <div class="control-group">
          <label> <input type="checkbox" id="debugMaster" /> FP_DEBUG </label>
          <input
            type="text"
            id="debugValue"
            value="*"
            placeholder="*, Loader, Loader,CRDTClock"
          />
        </div>

        <div class="control-group" id="localhostControls" style="display: none">
          <label>
            <input type="checkbox" id="useLocalhost" /> Use localhost:8989
          </label>
          <span class="help-text">no subdomain isolation</span>
        </div>

        <div class="control-group">
          <button id="loadButton">Load Lab</button>
          <button id="reloadButton">Reload All</button>
        </div>

        <div class="session-info">
          <span>Base SessionId: </span><span id="currentSession">-</span>
        </div>
      </div>

      <div class="iframe-grid">
        <div class="iframe-container">
          <div class="iframe-header">
            <span>Frame 1</span>
            <div class="frame-controls">
              <span class="status" id="status1">Ready</span>
              <button class="reload-btn" id="reload1">↻</button>
            </div>
          </div>
          <div class="iframe-content">
            <div class="iframe-overlay" id="overlay1">
              Click "Load Lab" to start
            </div>
            <iframe id="frame1" style="display: none"></iframe>
          </div>
        </div>

        <div class="iframe-container">
          <div class="iframe-header">
            <span>Frame 2</span>
            <div class="frame-controls">
              <span class="status" id="status2">Ready</span>
              <button class="reload-btn" id="reload2">↻</button>
            </div>
          </div>
          <div class="iframe-content">
            <div class="iframe-overlay" id="overlay2">
              Click "Load Lab" to start
            </div>
            <iframe id="frame2" style="display: none"></iframe>
          </div>
        </div>

        <div class="iframe-container">
          <div class="iframe-header">
            <span>Frame 3</span>
            <div class="frame-controls">
              <span class="status" id="status3">Ready</span>
              <button class="reload-btn" id="reload3">↻</button>
            </div>
          </div>
          <div class="iframe-content">
            <div class="iframe-overlay" id="overlay3">
              Click "Load Lab" to start
            </div>
            <iframe id="frame3" style="display: none"></iframe>
          </div>
        </div>

        <div class="iframe-container">
          <div class="iframe-header">
            <span>Frame 4</span>
            <div class="frame-controls">
              <span class="status" id="status4">Ready</span>
              <button class="reload-btn" id="reload4">↻</button>
            </div>
          </div>
          <div class="iframe-content">
            <div class="iframe-overlay" id="overlay4">
              Click "Load Lab" to start
            </div>
            <iframe id="frame4" style="display: none"></iframe>
          </div>
        </div>
      </div>
    </div>

    <script>
      // Session management
      const STORAGE_KEY = "lab-sessions";
      const MAX_STORED_SESSIONS = 10;

      function generateSessionId() {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = (now.getMonth() + 1).toString().padStart(2, "0");
        const day = now.getDate().toString().padStart(2, "0");
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        return \`\${year}\${month}\${day}\${hours}\${minutes}\${seconds}\`;
      }

      function getStoredSessions() {
        try {
          return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch {
          return [];
        }
      }

      function storeSession(sessionId) {
        const sessions = getStoredSessions();
        const updated = [
          sessionId,
          ...sessions.filter((s) => s !== sessionId),
        ].slice(0, MAX_STORED_SESSIONS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        populateSessionSelect();
      }

      function populateSessionSelect() {
        const select = document.getElementById("sessionSelect");
        const sessions = getStoredSessions();

        // Clear existing options except first
        select.innerHTML = '<option value="">Generate New Session</option>';

        sessions.forEach((session) => {
          const option = document.createElement("option");
          option.value = session;
          option.textContent = session;
          select.appendChild(option);
        });
      }

      // Initialize session dropdown
      populateSessionSelect();

      // Check if running on localhost and show localhost controls
      function initLocalhostControls() {
        const isLocalhost =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";

        if (isLocalhost) {
          document.getElementById("localhostControls").style.display = "flex";

          const useLocalhost = document.getElementById("useLocalhost");
          const LOCALHOST_STORAGE_KEY = "lab-use-localhost";

          // Load localhost preference
          try {
            const savedLocalhost = localStorage.getItem(LOCALHOST_STORAGE_KEY);
            if (savedLocalhost !== null) {
              useLocalhost.checked = savedLocalhost === "true";
            }
          } catch (e) {
            console.warn("Failed to load localhost preference:", e);
          }

          // Save localhost preference when changed
          useLocalhost.addEventListener("change", function () {
            try {
              localStorage.setItem(
                LOCALHOST_STORAGE_KEY,
                useLocalhost.checked.toString(),
              );
            } catch (e) {
              console.warn("Failed to save localhost preference:", e);
            }
          });
        }
      }

      // Debug control logic
      function initDebugControls() {
        const debugMaster = document.getElementById("debugMaster");
        const debugValue = document.getElementById("debugValue");
        const DEBUG_STORAGE_KEY = "lab-debug-enabled";
        const DEBUG_VALUE_STORAGE_KEY = "lab-debug-value";

        // Load debug state from localStorage
        function loadDebugState() {
          try {
            const savedEnabled = localStorage.getItem(DEBUG_STORAGE_KEY);
            const savedValue = localStorage.getItem(DEBUG_VALUE_STORAGE_KEY);

            if (savedEnabled !== null) {
              debugMaster.checked = savedEnabled === "true";
            }
            if (savedValue !== null) {
              debugValue.value = savedValue;
            }

            // Set initial input state
            debugValue.disabled = !debugMaster.checked;
          } catch (e) {
            console.warn("Failed to load debug state from localStorage:", e);
          }
        }

        // Save debug state to localStorage
        function saveDebugState() {
          try {
            localStorage.setItem(
              DEBUG_STORAGE_KEY,
              debugMaster.checked.toString(),
            );
            localStorage.setItem(DEBUG_VALUE_STORAGE_KEY, debugValue.value);
          } catch (e) {
            console.warn("Failed to save debug state to localStorage:", e);
          }
        }

        // Master checkbox controls debug input
        debugMaster.addEventListener("change", function () {
          debugValue.disabled = !debugMaster.checked;
          saveDebugState();
        });

        // Save debug value when it changes
        debugValue.addEventListener("input", function () {
          saveDebugState();
        });

        // Initialize state
        loadDebugState();
      }

      // Initialize controls
      initLocalhostControls();
      initDebugControls();

      // Lab execution
      async function loadLab() {
        const vibeSlug = document.getElementById("vibeSlug").value.trim();
        const sessionSelect = document.getElementById("sessionSelect");
        const fireproofVersion = document
          .getElementById("fireproofVersion")
          .value.trim();
        const loadButton = document.getElementById("loadButton");

        if (!vibeSlug) {
          alert("Please enter a vibe slug");
          return;
        }

        // Generate or use selected session
        let sessionId = sessionSelect.value;
        if (!sessionId) {
          sessionId = generateSessionId();
          storeSession(sessionId);
        }

        // Update UI
        document.getElementById("currentSession").textContent = sessionId;
        loadButton.disabled = true;
        loadButton.textContent = "Loading...";

        try {
          // Fetch vibe code
          setAllStatus("loading", "Fetching vibe code...");

          const response = await fetch(
            \`https://\${vibeSlug}.vibesdiy.app/App.jsx\`,
          );
          if (!response.ok) {
            throw new Error(
              \`Failed to fetch vibe code: HTTP \${response.status}\`,
            );
          }
          const vibeCode = await response.text();

          // Load 4 iframes with unique subdomains
          const promises = [];
          for (let i = 1; i <= 4; i++) {
            promises.push(
              loadFrame(i, sessionId, vibeCode, fireproofVersion, vibeSlug),
            );
          }

          await Promise.allSettled(promises);
        } catch (error) {
          console.error("Lab loading failed:", error);
          setAllStatus("error", \`Failed: \${error.message}\`);
        } finally {
          loadButton.disabled = false;
          loadButton.textContent = "Load Lab";
        }
      }

      async function loadFrame(
        frameNum,
        sessionId,
        vibeCode,
        fireproofVersion,
        vibeSlug,
      ) {
        const frameId = \`frame\${frameNum}\`;
        const statusId = \`status\${frameNum}\`;
        const overlayId = \`overlay\${frameNum}\`;

        const frame = document.getElementById(frameId);
        const status = document.getElementById(statusId);
        const overlay = document.getElementById(overlayId);

        try {
          // Check if using localhost
          const useLocalhost = document.getElementById("useLocalhost");
          const isLocalhost = useLocalhost && useLocalhost.checked;

          // Build iframe URL
          let iframeUrl;
          if (isLocalhost) {
            // Use localhost without subdomain isolation
            iframeUrl = "http://localhost:8989/";
          } else {
            // Use subdomain isolation
            const subdomain = \`\${sessionId}-\${frameNum}\`;
            iframeUrl = \`https://\${subdomain}.vibesbox.dev/\`;
          }

          // Add fireproof version parameter if specified
          if (fireproofVersion) {
            const separator = iframeUrl.includes("?") ? "&" : "?";
            iframeUrl += \`\${separator}v_fp=\${encodeURIComponent(fireproofVersion)}\`;
          }

          setFrameStatus(frameNum, "loading", "Loading iframe...");

          // Set iframe source
          frame.src = iframeUrl;

          // Wait for iframe to load
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(
              () => reject(new Error("Iframe load timeout")),
              10000,
            );

            frame.onload = () => {
              clearTimeout(timeout);
              resolve();
            };

            frame.onerror = () => {
              clearTimeout(timeout);
              reject(new Error("Iframe failed to load"));
            };
          });

          setFrameStatus(frameNum, "loading", "Sending code...");

          // Check if debug is enabled
          const debugMaster = document.getElementById("debugMaster");
          const debugValue = document.getElementById("debugValue");

          let debugConfig = null;
          if (debugMaster.checked) {
            debugConfig = {
              enabled: true,
              value: debugValue.value || "*",
            };
          }

          // Send code to iframe with optional debug config
          const message = {
            type: "execute-code",
            code: vibeCode,
            apiKey: "sk-vibes-proxy-managed",
            sessionId: \`lab-\${sessionId}-\${frameNum}\`,
          };

          if (debugConfig) {
            message.debugConfig = debugConfig;
          }

          frame.contentWindow.postMessage(message, "*");

          // Show iframe, hide overlay
          frame.style.display = "block";
          overlay.style.display = "none";
          setFrameStatus(frameNum, "ready", "Running");
        } catch (error) {
          console.error(\`Frame \${frameNum} failed:\`, error);
          setFrameStatus(frameNum, "error", error.message);
          overlay.style.display = "flex";
          overlay.textContent = \`Error: \${error.message}\`;
        }
      }

      function setFrameStatus(frameNum, type, message) {
        const status = document.getElementById(\`status\${frameNum}\`);
        status.className = \`status \${type}\`;
        status.textContent = message;
      }

      function setAllStatus(type, message) {
        for (let i = 1; i <= 4; i++) {
          setFrameStatus(i, type, message);
          document.getElementById(\`overlay\${i}\`).style.display = "flex";
          document.getElementById(\`overlay\${i}\`).textContent = message;
          document.getElementById(\`frame\${i}\`).style.display = "none";
        }
      }

      // Reload all frames with current settings
      function reloadAllFrames() {
        const currentSessionSpan = document.getElementById("currentSession");
        const currentSessionId = currentSessionSpan.textContent;

        if (currentSessionId === "-") {
          alert('No lab session active. Click "Load Lab" first.');
          return;
        }

        // Ensure the dropdown is set to current session
        const sessionSelect = document.getElementById("sessionSelect");
        sessionSelect.value = currentSessionId;

        loadLab();
      }

      // Reload individual frame
      function reloadSingleFrame(frameNum) {
        const currentSessionSpan = document.getElementById("currentSession");
        const currentSessionId = currentSessionSpan.textContent;

        if (currentSessionId === "-") {
          alert('No lab session active. Click "Load Lab" first.');
          return;
        }

        const vibeSlug = document.getElementById("vibeSlug").value.trim();
        const fireproofVersion = document
          .getElementById("fireproofVersion")
          .value.trim();

        if (!vibeSlug) {
          alert("Please enter a vibe slug");
          return;
        }

        // Fetch and reload just this frame
        (async () => {
          try {
            setFrameStatus(frameNum, "loading", "Fetching vibe code...");

            const response = await fetch(
              \`https://\${vibeSlug}.vibesdiy.app/App.jsx\`,
            );
            if (!response.ok) {
              throw new Error(
                \`Failed to fetch vibe code: HTTP \${response.status}\`,
              );
            }
            const vibeCode = await response.text();

            await loadFrame(
              frameNum,
              currentSessionId,
              vibeCode,
              fireproofVersion,
              vibeSlug,
            );
          } catch (error) {
            console.error(\`Frame \${frameNum} reload failed:\`, error);
            setFrameStatus(frameNum, "error", error.message);
          }
        })();
      }

      // Event listeners
      document.getElementById("loadButton").addEventListener("click", loadLab);
      document
        .getElementById("reloadButton")
        .addEventListener("click", reloadAllFrames);

      // Individual reload button listeners
      for (let i = 1; i <= 4; i++) {
        document
          .getElementById(\`reload\${i}\`)
          .addEventListener("click", () => reloadSingleFrame(i));
      }

      // Listen for iframe messages
      window.addEventListener("message", function (event) {
        // Handle iframe communication if needed
        if (event.data && event.data.type === "execution-success") {
          console.log("Iframe execution successful");
        }
      });

      // Auto-populate URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("v_fp")) {
        document.getElementById("fireproofVersion").value =
          urlParams.get("v_fp");
      }
    </script>
  </body>
</html>`;

export default labHtml;
