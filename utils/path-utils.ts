import { ROUTES } from "@/constants/routes";

const getAllRoutes = (obj: any): string[] => {
  return Object.values(obj).reduce((acc: string[], value) => {
    if (typeof value === "string") {
      acc.push(value.split("?")[0]);
    } else if (typeof value === "object" && value !== null) {
      acc.push(...getAllRoutes(value));
    }
    return acc;
  }, []);
};

export const LAYOUT_PATHS = [
  ...getAllRoutes(ROUTES),
  "/posts/*",
  "/courses/*",
  "/course/*",
  "/streaming/*",
  "/classroom/*",
  "/search",
  "/search/*",

  "/socials",
  "/socials/following",
  "/socials/profile",
  "/socials/profile/*",
  "/socials/watchlist",
  "/socials/uploads",
  "/socials/edit-post",
  "/socials/edit-post/?*",

  "/studio",
  "/studio/course",
  "/studio/course/*",
  "/studio/course/long-course",
  "/studio/course/long-course/*",
  "/studio/course/short-course",
  "/studio/course/short-course/*",
  "/studio/course-management",
  "/studio/course-management/*",
  "/studio/event/meeting",
  "/studio/event/meeting/*",
  "/studio/event/classroom",
  "/studio/event/classroom/*",
  "/studio/calendar",
  "/studio/community",
  "/studio/community/*",
  "/studio/schedule",
  "/studio/learners",
  "/studio/analytics/*",

  "/market/*",
  "/market/saved",
  "/market/notifications",
  "/market/create-listing",
  "/market/seller-dashboard",
  "/market/your-listings",
  "/market/insight",
].filter((path) => !path.startsWith("/auth"));

export const shouldUseMainLayout = (pathname: string): boolean => {
  return LAYOUT_PATHS.some((pattern) => {
    const regexPattern =
      pattern.replace(/\*/g, ".*").replace(/\//g, "\\/") + "$";
    const regex = new RegExp(`^${regexPattern}`);
    return regex.test(pathname);
  });
};
