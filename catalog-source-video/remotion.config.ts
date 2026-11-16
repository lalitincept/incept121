import { Config } from '@remotion/cli/config';

// Rendering defaults for this project.
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setConcurrency(4);
Config.setChromiumOpenGlRenderer('angle');
// Pre-installed headless shell in this environment (override with REMOTION_BROWSER if needed).
const browser =
  process.env.REMOTION_BROWSER ??
  '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
Config.setBrowserExecutable(browser);
Config.setDelayRenderTimeoutInMilliseconds(120000);
