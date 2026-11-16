import fs from "fs";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setEntryPoint("./src/index.ts");

// Use a locally installed headless Chromium when present (e.g. CI / sandboxes).
const localShell =
  process.env.REMOTION_BROWSER ??
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (fs.existsSync(localShell)) Config.setBrowserExecutable(localShell);
