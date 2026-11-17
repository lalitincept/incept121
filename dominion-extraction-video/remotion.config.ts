import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setConcurrency(4);
// Use the pre-installed headless Chromium (no download needed).
Config.setBrowserExecutable('/opt/pw-browsers/chromium_headless_shell');
Config.setChromiumOpenGlRenderer('swangle');
