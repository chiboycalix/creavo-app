export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/auth?tab=signin",
  SIGN_UP: "/auth?tab=signup",
  FORGOT_PASSWORD: "/auth/forgot-password",
  SETUP_PROFILE: "/auth/setup",
  SELECT_INTERESTS: "/auth/interest",
  VALIDATE_OTP: (email: string) => `/auth/validate-otp?email=${email}`,

  LIVE: "/live",
  SCHEDULE: "/schedule",
  SCHEDULE_DETAILS: (id: string) => `/schedule/details/${id}`,
  UPLOADS: "/uploads",
  PROFILE: (id: string) => `/socials/profile`,
  POSTS: (id: string) => `/posts/${id}`,

  COURSES: "/courses",
  COURSE_DETAILS: (id: string) => `/courses/${id}`,
  COURSE: (id: string) => `/course/${id}`,
  CREATE_COURSE: (courseName: string) => `/studio/course/${courseName}`,

  STREAMING: (id: string) => `/streaming/${id}`,
  VIDEO_CONFERENCING: {
    MEETING: "/studio/event/meeting",
    MEETING_CHANNEL: (channelName: string) =>
      `/studio/event/meeting/${channelName}`,
    SCHEDULE: "/studio/meeting/schedule",
    LIVE: "/studio/meeting/live",
    LEAVE_MEETING: "/studio/event/meeting/leave-meeting",
  },

  MARKETPLACE: "/market",

  CLASSROOM: {
    OVERVIEW: "/classroom/overview",
    COURSES: "/classroom/courses",
    TRAINEE: "/classroom/trainee",
    MESSAGING: "/classroom/messaging",
    COMMUNITIES: "/classroom/communities",
    ANALYTICS: "/classroom/analytics",
    MY_LEARNING: "/classroom/my-learning",
  },
};
