import { useState, useEffect } from "react";
import { getMediaDimensionsClientSide } from "@/utils";

interface MediaDimensions {
  width: number;
  height: number;
  type: "image" | "video" | "unknown";
}

export function useMediaDimensions(url?: string): MediaDimensions {
  const [dimension, setDimension] = useState<MediaDimensions>({
    width: 0,
    height: 0,
    type: "unknown",
  });

  useEffect(() => {
    if (!url) return;

    let isMounted = true;

    const fetchDimensions = async () => {
      try {
        const response = await getMediaDimensionsClientSide(url);
        if (isMounted) {
          setDimension(response);
        }
      } catch (error) {
        console.error("Error fetching media dimensions:", error);
        if (isMounted) {
          setDimension({ width: 0, height: 0, type: "unknown" });
        }
      }
    };

    fetchDimensions();
    return () => {
      isMounted = false;
    };
  }, [url]);

  return dimension;
}
