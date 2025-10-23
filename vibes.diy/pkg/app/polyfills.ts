/**
 * Polyfills for Web Crypto API
 * Ensures crypto.subtle is available for jose library
 */

// Ensure crypto is available globally for jose library
if (typeof window !== "undefined") {
  console.log("🔍 Debugging crypto availability:");
  console.log("  window.crypto:", typeof window.crypto);
  console.log("  window.crypto.subtle:", typeof window.crypto?.subtle);
  console.log("  globalThis.crypto:", typeof globalThis.crypto);
  console.log("  location.protocol:", window.location.protocol);
  console.log("  location.hostname:", window.location.hostname);
  
  // Web Crypto API requires HTTPS or localhost
  const isSecureContext = window.isSecureContext;
  console.log("  isSecureContext:", isSecureContext);
  
  if (!isSecureContext) {
    console.error("⚠️ NOT A SECURE CONTEXT! Web Crypto API requires HTTPS or localhost!");
  }
  
  // Make sure window.crypto is available
  if (!window.crypto) {
    console.error("❌ window.crypto is not available");
  } else if (!window.crypto.subtle) {
    console.error("❌ window.crypto.subtle is not available");
  } else {
    console.log("✓ window.crypto.subtle exists");
  }
  
  // Ensure globalThis.crypto points to window.crypto
  if (!globalThis.crypto && window.crypto) {
    // @ts-ignore
    globalThis.crypto = window.crypto;
    console.log("✓ Set globalThis.crypto = window.crypto");
  }
  
  // Double check crypto.subtle is available
  if (globalThis.crypto && !globalThis.crypto.subtle && window.crypto?.subtle) {
    // @ts-ignore
    globalThis.crypto.subtle = window.crypto.subtle;
    console.log("✓ Set globalThis.crypto.subtle");
  }
  
  // Final check
  if (globalThis.crypto?.subtle) {
    console.log("✅ Web Crypto API is ready");
  } else {
    console.error("❌ Web Crypto API (crypto.subtle) is NOT available");
  }
}

export {};
