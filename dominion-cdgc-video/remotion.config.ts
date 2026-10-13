import { Config } from '@remotion/cli/config';

// Video encoder settings (codec, CRF, x264 preset, pixel format) live in the
// `npm run render` script so audio-only renders (e.g. --codec=wav) still work.
Config.setVideoImageFormat('png');
Config.setConcurrency(4);
Config.setOverwriteOutput(true);
