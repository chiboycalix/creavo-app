"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import SkeletonLoader from "@/components/SkeletonLoader";
import ProfileErrorCode from "@/components/ProfileErrorCode";
import PostLink from "@/components/post/PostLink";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, FolderIcon } from "lucide-react";
import { Course, MyLearning, Post, UserProfile } from "@/types/courses";
import { BsEye } from "react-icons/bs";
import { EyeIcon } from "@heroicons/react/24/solid";
import { formatCommentDate } from "@/utils";

interface ProfileTabsProps {
  isCurrentUser: boolean;
  courses: Course[] | null;
  posts: Post[] | null;
  myLearning: MyLearning[] | null;
  loadingCourses: boolean;
  loadingPosts: boolean;
  user: UserProfile;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  isCurrentUser,
  courses,
  posts,
  myLearning,
  loadingCourses,
  loadingPosts,
  user,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabs = React.useMemo(() => {
    const baseTabs = [
      `posts (${posts && posts?.length || 0})`,
      `courses (${courses?.length || 0})`,
    ];
    if (isCurrentUser) baseTabs.push(`saved videos (${myLearning?.length || 0})`);
    return baseTabs;
  }, [isCurrentUser, courses, posts, myLearning]);

  const initialTab = (searchParams.get("tab") as string) || tabs[0];
  const [selectedTab, setSelectedTab] = useState(tabs.indexOf(initialTab));

  useEffect(() => {
    const currentTab = searchParams.get("tab") as string;
    if (currentTab && tabs.includes(currentTab)) {
      setSelectedTab(tabs.indexOf(currentTab));
    }
  }, [searchParams, tabs, posts]);

  const handleTabChange = (index: number) => {
    const tab = tabs[index];
    router.push(`?tab=${tab}`);
    setSelectedTab(index);
  };
  console.log({ posts })
  return (
    <TabGroup selectedIndex={selectedTab} onChange={handleTabChange}>
      <TabList className="w-full flex items-center justify-center pt-4">
        {tabs?.map((tab, index) => (
          <Tab
            key={index}
            className={({ selected }) =>
              `w-28 text-center py-1.5 text-[14px] font-medium capitalize
              ${selected
                ? "border-b-4 rounded-b-sm outline-none border-primary font-semibold text-primary"
                : "text-gray-500 hover:text-black"
              }`
            }
          >
            {tab}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        <TabPanel>
          <div className="mt-4 grid 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
            {loadingPosts ? (
              [...Array(3)].map((_, index) => (
                <SkeletonLoader key={index} type="post" />
              ))
            ) : posts && posts?.length > 0 ? (
              posts?.map((post: any, index) => (
                <PostLink postId={Number(post?.id)} key={index}>
                  {post?.media && post?.media?.length > 0 && (
                    <div>
                      {(() => {
                        const media = post.media[0]; // Access the first item
                        const isVideo = media.mimeType.startsWith("video/") || media.url.endsWith(".mp4");

                        return (
                          <div className="mb-2">
                            {isVideo ? (
                              <video
                                src={media.url}
                                controls
                                className="w-full h-72 object-contain rounded-lg border"
                              />
                            ) : (
                              <Image
                                width={500}
                                height={256}
                                src={media.url}
                                alt="Post media"
                                className="w-full h-72 object-cover rounded-lg border"

                              />
                            )}
                            <div className="mt-1">
                              <p className="font-semibold text-xs">{post.title}</p>
                              <p></p>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                              <p className="font-semibold text-xs flex items-center gap-2"><EyeIcon className="w-4" /> {post.viewsCount} view</p>
                              <p className="text-xs">{formatCommentDate(post?.createdAt)}</p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </PostLink>
              ))
            ) : (
              <div className="col-span-6 text-center">
                <ProfileErrorCode
                  icon={"/assets/icons/file-error.svg"}
                  username={user ? user.username : "Join crevoe"}
                  errorMessage="This page is empty because you haven't started uploading any reel. Start uploading lessons to populate this page."
                  buttonText="Start Uploading"
                  href="/upload"

                />
              </div>
            )}
          </div>
        </TabPanel>
        {/* Courses Tab */}
        <TabPanel>
          <div className="mt-4 grid 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
            {loadingCourses ? (
              [...Array(3)].map((_, index) => (
                <SkeletonLoader key={index} type="course" />
              ))
            ) : courses && courses?.length > 0 ? (
              courses.map((course) => (
                <div key={course.id} className="flex flex-col">
                  <a href={`/courses/${course.id}`}>
                    <div className=" inset-0 flex items-center justify-center bg-gray-100 p-1 rounded-md">
                      <FolderIcon className="h-16 w-16 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {course.title}
                      </h3>
                      {!course.type && (
                        <p className="text-xs text-gray-500 truncate">
                          {course.description}
                        </p>
                      )}
                    </div>
                  </a>
                </div>
              ))
            ) : (
              <div className="col-span-6">
                <ProfileErrorCode
                  username={isCurrentUser ? user.username : "Welcome to crevoe"}
                  errorMessage={
                    isCurrentUser
                      ? "This page is empty because you haven't started uploading yet. Start uploading to populate this page."
                      : "This page is empty because the user hasn't started uploading yet."
                  }
                  buttonText={
                    isCurrentUser ? "Start Uploading" : "Start Exploring"
                  }
                  href={isCurrentUser ? "/uploads" : "/"}
                />
              </div>
            )}
          </div>
        </TabPanel>

        {isCurrentUser && (
          <TabPanel>
            <div className="mt-4 grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3">
              {myLearning && myLearning?.length > 0 ? (
                myLearning.map((item, index) => (
                  <div key={index} className="p-4 bg-white rounded-md shadow">
                    {item.title}
                  </div>
                ))
              ) : (
                <div className="col-span-6 text-center">
                  <ProfileErrorCode
                    icon={"/assets/icons/file-error.svg"}
                    username={user ? user.username : "Join crevoe"}
                    errorMessage="This page is empty because you haven't started learning any courses yet. Start learning to populate this page."
                    buttonText="Start Exploring"
                    href="/upload"
                  />
                </div>
              )}
            </div>
          </TabPanel>
        )}
        <div className="pb-16"></div>
      </TabPanels>
    </TabGroup>
  );
};

export default ProfileTabs;
