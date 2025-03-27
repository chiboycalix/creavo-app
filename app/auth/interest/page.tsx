"use client"
import React, { useState, useEffect } from "react";
import ButtonLoader from "@/components/ButtonLoader";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/Input";
import { useToast } from "@/context/ToastContext";

const topicsList = [
  "Product design",
  "Baking",
  "Knitting",
  "Painting",
  "Animation",
  "UI/UX",
  "Video editing",
  "Miro",
  "Html",
  "Marketing",
  "Phonics",
  "AI",
  "Figma",
];

export default function TopicSelection() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const { getCurrentUser, setAuth } = useAuth();

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const user = getCurrentUser();

  const handleSkip = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/");
  };

  const filteredTopics = topicsList?.filter((topic) =>
    topic?.toLowerCase().includes(search?.toLowerCase())
  );

  useEffect(() => {
  }, [selectedTopics]);

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    const requestPayload = {
      firstName: user?.firstName,
      lastName: user?.lastName,
      bio: user?.bio,
      username: user?.username,
      avatar: user?.avatar,
      interest: selectedTopics,
    };

    try {
      const response = await fetch(`${baseUrl}/profiles`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify(requestPayload),
      });

      const data = await response.json();
      if (!response.ok) {
        showToast(
          'error',
          "An error occured",
          data.message
        );
      }

      setAuth(true, data.data);

      router.push("/");
    } catch (error: any) {
      showToast(
        'error',
        "An error occured",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col items-center w-full">
        <div className="w-full px-8 py-24">
          <h2 className="text-2xl font-semibold mb-3 text-center">Almost done!</h2>
          <p className="mb-3 text-gray-600 text-sm text-center">
            Select topics of your interest to personalize your experience.
          </p>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-1 w-full text-sm focus:ring-1 focus:ring-primary-500"
            variant="search" placeholder="Search topics"
          />

          <div className="flex flex-wrap justify-center gap-2 my-8">
            {filteredTopics &&
              filteredTopics?.map((topic) => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`px-4 py-2 rounded-full shadow-sm text-sm ${selectedTopics?.includes(topic)
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {topic}
                </button>
              ))}
          </div>

          <Button
            disabled={loading}
            onClick={handleSave}
            className="border-0 p-2.5 text-sm cursor-pointer rounded-lg text-white w-full font-medium leading-6"
          >
            <ButtonLoader
              isLoading={loading}
              caption="Save and Continue"
            />
          </Button>

          <Button
            onClick={handleSkip}
            className="w-full mt-3 text-sm bg-transparent border border-primary-100 hover:bg-gray-200 text-gray-600 rounded-md"
          >
            Skip for now
          </Button>

          <p className="mt-4 text-center text-gray-600 text-sm">
            You can skip this for now and set up your profile later in the
            settings.
          </p>
        </div>
      </div>
    </>
  );
}
