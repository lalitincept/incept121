// Render settings for every `remotion render` and `remotion studio` run.
// https://www.remotion.dev/docs/config
import {Config} from '@remotion/cli/config';

// High-quality JPEG frames keep gradients and grain from banding before encoding.
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);
