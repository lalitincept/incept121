import { Config } from '@remotion/cli/config';

// 4K master: lossless-ish intermediate frames, high-quality H.264 output.
Config.setVideoImageFormat('png');
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setX264Preset('slow');
Config.setConcurrency(4);
Config.setOverwriteOutput(true);
Config.setAudioBitrate('320k');
