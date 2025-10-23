import type { LlmConfig } from "./types.js";

export const webAudioConfig: LlmConfig = {
  name: "web-audio",
  label: "Web Audio API",
  module: "web-audio",
  description:
    "Web Audio fundamentals; echo/delay with effects in the feedback path; mic monitoring with a metronome; audio‑clock scheduling; timing design for multi‑channel drum machines and MIDI synths with accurate voice overlap.",
  importModule: "web-audio",
  importName: "WebAudioAPI",
};
