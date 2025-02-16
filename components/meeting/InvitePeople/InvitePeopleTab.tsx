'use client';

import Spinner from "@/components/Spinner";
import { Input } from "@/components/Input";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useVideoConferencing } from "@/context/VideoConferencingContext";
import { fetchFollowers, fetchFollowings, sendInvites } from "@/lib/api/users";
import { UserBadge } from "@/components/meeting/InvitePeople/UserBadge";
import { UserListItem } from "@/components/meeting/InvitePeople/UserListItem";
import { toast } from "sonner";

type User = {
  id: string;
  username: string;
  email: string;
};

type TabValue = 'following' | 'followers' | 'email';

export default function InvitePeopleTab() {
  const { getCurrentUser } = useAuth();
  const userId = getCurrentUser()?.id;
  const roomId = useVideoConferencing()?.channelName;

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [externalEmailUsers, setExternalEmailUsers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabValue>('following');

  const { data: followings } = useQuery({
    queryKey: ['followings', userId],
    queryFn: () => fetchFollowings(userId),
    enabled: activeTab === 'following' && !!userId,
  });

  const { data: followers } = useQuery({
    queryKey: ['followers', userId],
    queryFn: () => fetchFollowers(userId),
    enabled: activeTab === 'followers' && !!userId,
  });


  const { mutate: sendInvitation, isPending: isSending } = useMutation({
    mutationFn: () => sendInvites({
      externalParticipant: externalEmailUsers,
      internalParticipant: selectedUsers.map(user => user.email),
      roomCode: roomId!
    }),
    onSuccess: () => {
      toast.success("Invitation(s) sent successfully")
      setSelectedUsers([]);
      setExternalEmailUsers([]);
    },
  });

  const handleUserToggle = (user: User) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.id === user.id);
      return isSelected
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user];
    });
  };

  const handleEmailSubmit = (email: string) => {
    if (email && !externalEmailUsers.includes(email)) {
      setExternalEmailUsers(prev => [...prev, email]);
    }
  };

  const removeUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== userId));
  };

  const removeEmail = (email: string) => {
    setExternalEmailUsers(prev => prev.filter(e => e !== email));
  };

  return (
    <Tabs
      defaultValue="following"
      className="w-full"
      onValueChange={(value) => setActiveTab(value as TabValue)}
    >
      <TabsList className="grid w-full grid-cols-3 bg-white">
        {['following', 'followers', 'email'].map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="bg-white rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary-900"
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>

      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {selectedUsers.map((user) => (
            <UserBadge
              key={user.id}
              label={user.username}
              onRemove={() => removeUser(user.id)}
            />
          ))}
        </div>
      )}

      {/* Following Tab */}
      <TabsContent value="following">
        <div className="space-y-4">
          <Input
            variant="search"
            placeholder="Search"
            className="border bg-transparent"
          />
          {followings?.data?.followings?.map((user: User) => (
            <UserListItem
              key={user.id}
              user={user}
              isSelected={selectedUsers.some(u => u.id === user.id)}
              onToggle={() => handleUserToggle(user)}
            />
          ))}
        </div>
      </TabsContent>

      {/* Followers Tab */}
      <TabsContent value="followers">
        <div className="space-y-4">
          <Input
            variant="search"
            placeholder="Search"
            className="border bg-transparent"
          />
          {followers?.data?.followers?.map((user: User) => (
            <UserListItem
              key={user.id}
              user={user}
              isSelected={selectedUsers.some(u => u.id === user.id)}
              onToggle={() => handleUserToggle(user)}
            />
          ))}
        </div>
      </TabsContent>

      {/* Email Tab */}
      <TabsContent value="email">
        <Input
          variant="text"
          placeholder="Enter Email"
          className="border bg-transparent"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleEmailSubmit(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        />
        {externalEmailUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {externalEmailUsers.map((email, index) => (
              <UserBadge
                key={index}
                label={email}
                onRemove={() => removeEmail(email)}
              />
            ))}
          </div>
        )}
      </TabsContent>

      {/* Send Invite Button */}
      {(selectedUsers.length > 0 || externalEmailUsers.length > 0) && (
        <div className="mt-6">
          <Button
            className="w-full bg-primary-900 text-white hover:bg-primary-800"
            onClick={() => sendInvitation()}
            disabled={isSending}
          >
            {isSending ? <Spinner /> : `Send Invite (${selectedUsers.length + externalEmailUsers.length})`}
          </Button>
        </div>
      )}
    </Tabs>
  );
}