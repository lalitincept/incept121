import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
// Generous cache for OffthreadVideo frame extraction of the 4K-ready recording
Config.setOffthreadVideoCacheSizeInBytes(2 * 1024 * 1024 * 1024);
