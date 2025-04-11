import React, { useState } from 'react';
import CreateCommunityPost from './CreateCommunityPost';
import Avatar from '@/components/Avatar';
import { TextInput } from '@/components/Input/TextInput';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
interface MessageInputProps {
  spaceId: string;
  communityId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ spaceId, communityId }) => {
  const [isInputDialogOpen, setIsInputDialogOpen] = useState(false);
  const { currentUser } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useUserProfile(currentUser?.id);

  const handleInputClick = () => {
    setIsInputDialogOpen(true);
  };

  return (
    <form
      className="py-2 border-t border-gray-200 bg-white"
    >
      <div className='w-full px-4 flex items-center gap-2'>
        <div className='basis-0.5/12 bg-gray-200 p-1 rounded-full'>
          <Avatar
            profileLoading={profileLoading}
            profileData={profileData}
            className="border-2 border-primary-500 w-12 h-12"
          />
        </div>
        <TextInput
          placeholder='Write a general post'
          value={""}
          className='flex-1'
          isClickable={true}
          onClick={handleInputClick}
        />
      </div>
      <Dialog open={isInputDialogOpen} onOpenChange={setIsInputDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className='text-sm'>Create post</DialogTitle>
          </DialogHeader>
          <CreateCommunityPost
            spaceId={spaceId}
            communityId={communityId}
            setIsInputDialogOpen={setIsInputDialogOpen}
          />
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default MessageInput;
