import RemotionVideo from "@/app/dashboard/_components/RemotionVideo";
import React from "react";
import { Composition, RemotionVideoProps } from "remotion";

function RemotionRoot() {
  //   const MyComposition = () => {
  //     return null;
  //   };
  return (
    <>
      <Composition
        id="Empty"
        component={RemotionVideo as React.ComponentType<RemotionVideoProps>}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
}

export default RemotionRoot;
