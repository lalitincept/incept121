import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { FPS, H, TOTAL_FRAMES, W } from "./theme";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="CatalogJobs"
      component={Main}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={W}
      height={H}
    />
  </>
);
