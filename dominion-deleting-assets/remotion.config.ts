import {Config} from '@remotion/cli/config';

// Near-lossless master: lossless PNG frames, BT.709 colour, very low CRF.
// Delivery files are encoded from this master by scripts/deliver.sh.
Config.setVideoImageFormat('png');
Config.setColorSpace('bt709');
Config.setCodec('h264');
Config.setCrf(6);
Config.setPixelFormat('yuv420p');
Config.setX264Preset('veryfast');
Config.setOverwriteOutput(true);

// Allow pointing at a locally installed Chromium (e.g. in CI or sandboxed machines).
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
