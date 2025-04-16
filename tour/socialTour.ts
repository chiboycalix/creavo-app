import type { TourStep } from "@/context/TourContext"

export const socialsTourSteps: TourStep[] = [
  {
    target: ".tour-for-you",
    content: "Discover personalized learning recommendations based on your interests and past activity.",
    placement: "right",
  },
  {
    target: ".tour-following",
    content: "Stay connected with your favorite creators and educators.",
    placement: "right",
  },
  {
    target: ".tour-upload",
    content:
      "Share your thoughts, ideas, or questions with the Crevoe community. Click here to create and upload your own post!",
    placement: "right",
  },
  {
    target: ".tour-watchlist",
    content:
      "Not ready to learn it now? Save it for later. Keep track of courses, videos, and events you want to dive into later.",
    placement: "right",
  },
  {
    target: ".tour-profile",
    content: "View your progress, customize your settings, and showcase your achievements to the community",
    placement: "right",
  },
  {
    target: "#notification-step-anchor",
    content: "Check here for updates on new courses, replies to your posts, or upcoming events.",
    placement: "bottom",
  },
]
