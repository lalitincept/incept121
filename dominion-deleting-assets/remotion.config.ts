import {Config} from '@remotion/cli/config';

// Master quality: high-quality JPEG intermediates, H.264 at a low CRF.
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(96);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setX264Preset('slow');
Config.setOverwriteOutput(true);

// Allow pointing at a locally installed Chromium (e.g. in CI or sandboxed machines).
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
