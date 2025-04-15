"use client";

import { useState, useEffect } from "react";
import Joyride, { CallBackProps, } from "react-joyride";
import CustomTooltip from "@/components/socials/tour/custom-tooltip";
import { CommentProvider } from "@/context/CommentsContext";
import { useFetchInfinitePosts } from "@/hooks/posts/useFetchInfinitePosts";
import SocialFeed from "@/components/socials/explore/SocialFeed";
import { socialsTourSteps } from "@/tour/socialTour";

export default function ExplorePage() {
  const { data, isFetching } = useFetchInfinitePosts();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const seenTour = localStorage.getItem("socialsTourDone");
      if (!seenTour) {
        setRun(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleTourCallback = (data: CallBackProps) => {
    const { status, index, type } = data;

    if (["finished", "skipped"].includes(status)) {
      setRun(false);
      localStorage.setItem("socialsTourDone", "true");
    } else {
      if (type === "step:after") {
        setStepIndex(index + 1);
      }
    }
  };

  return (
    <CommentProvider posts={data?.pages[0]}>
     <Joyride
  steps={socialsTourSteps}
  run={run}
  stepIndex={stepIndex}
  continuous
  scrollToFirstStep
  showProgress
  showSkipButton={false}
  disableScrolling={false}
  disableOverlayClose
  spotlightClicks
  callback={handleTourCallback}
  tooltipComponent={CustomTooltip}
  styles={{
    options: {
      primaryColor: "#0b66c3",
      zIndex: 10000,
      overlayColor: "rgba(0, 0, 0, 0.5)",
    }
  }}
/>
{/* <button onClick={() => localStorage.removeItem("socialsTourDone")}>
  Reset Tour
</button> */}

      
      <SocialFeed 
        initialPosts={data?.pages[0]}
        isFetcingPosts={isFetching}
      />
    </CommentProvider>
  );
}