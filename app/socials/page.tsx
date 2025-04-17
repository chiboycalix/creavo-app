"use client"
import { CommentProvider } from "@/context/CommentsContext"
import { useFetchInfinitePosts } from "@/hooks/posts/useFetchInfinitePosts"
import SocialFeed from "@/components/socials/explore/SocialFeed"
import { TourProvider } from "@/context/TourContext"
import Tour from "@/components/socials/tour/tour"
import { socialsTourSteps } from "@/tour/socialTour"
import ProtectedRoute from "@/components/ProtectedRoute";
import TourButton from "@/components/socials/tour/tour-button"
import TourDebug from "@/components/socials/tour/tour-debug"

export default function ExplorePage() {
  const { data, isFetching } = useFetchInfinitePosts()
  const handleTourComplete = () => {
    console.log("Tour completed!")
    
  }

  return (
    <TourProvider
      steps={socialsTourSteps}
      tourKey="socialsTourProgress"
      autoStart={true}
      startDelay={1000}
      onComplete={handleTourComplete}
    >
      <CommentProvider posts={data?.pages[0]}>
         <ProtectedRoute
              requireAuth={true}
              requireVerification={true}
              requireProfileSetup={false}
            >
        <Tour />
        </ProtectedRoute>
        {/* <TourButton/> */}
        <SocialFeed initialPosts={data?.pages[0]} isFetcingPosts={isFetching} />
      </CommentProvider>
    </TourProvider>
  )
}
