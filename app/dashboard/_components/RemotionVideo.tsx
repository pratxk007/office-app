import { useEffect } from "react";
import {
    AbsoluteFill,
    Audio,
    Img,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
  } from "remotion";
  
  type Caption = {
    start: number;
    end: number;
    text: string;
  };
  
  interface RemotionVideoProps {
    script: string;
    imageList: string[];
    audioFileUrl: string;
    captions: Caption[];
    setDurationInFrame: (durationInFrame: number) => void;
  }

  
  function RemotionVideo({
    imageList,
    audioFileUrl,
    captions,
    setDurationInFrame,
  }: RemotionVideoProps): JSX.Element {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();
  
    // UseEffect to set the duration in frame only once
    useEffect(() => {
      const getDurationFrame = () => {
        // Calculate the duration in frames based on the last caption
        const lastCaption = captions[captions.length - 1];
        const durationInFrames = (lastCaption?.end / 1000) * fps;
        setDurationInFrame(durationInFrames);
        return durationInFrames;
      };
      
      if (captions.length > 0) {
        getDurationFrame();
      }
    }, [captions, fps, setDurationInFrame]);
  
    const getCurrentCaptions = () => {
      const currentTime = (frame / 30) * 100;
      const currentCaption = captions.find(
        (word) => currentTime >= word.start && currentTime <= word.end
      );
      return currentCaption ? currentCaption?.text : "";
    };
  
    return (
      <AbsoluteFill className="bg-black">
        {imageList?.map((ele, idx) => {
          const durationInFrames = (captions[captions.length - 1]?.end / 1000) * fps;
  
          return (
            <Sequence
              key={idx}
              from={(idx * durationInFrames) / imageList.length}
              durationInFrames={durationInFrames}
            >
              <AbsoluteFill
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <Img
                  src={ele}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <AbsoluteFill
                  style={{
                    justifyContent: "center",
                    color: "white",
                    top: undefined,
                    bottom: 50,
                    height: 150,
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  <h2 className="text-2xl">{getCurrentCaptions()}</h2>
                </AbsoluteFill>
              </AbsoluteFill>
            </Sequence>
          );
        })}
        <Audio src={audioFileUrl} />
      </AbsoluteFill>
    );
  }
  
  export default RemotionVideo;
  