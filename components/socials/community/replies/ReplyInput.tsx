import React, { useState } from 'react';
import Avatar from '@/components/Avatar';
import { TextInput } from '@/components/Input/TextInput';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CreateMessageReply from './CreateMessageReply';

interface ReplyInputProps {
  spaceId: string;
  communityId: string;
  messageId: string;
  mId: string;
}

const ReplyInput: React.FC<ReplyInputProps> = ({ spaceId, communityId, messageId, mId }) => {
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
          placeholder='Write a reply to this post'
          value={""}
          className='flex-1'
          isClickable={true}
          onClick={handleInputClick}
        />
      </div>
      <Dialog open={isInputDialogOpen} onOpenChange={setIsInputDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className='text-sm'>Reply Message</DialogTitle>
          </DialogHeader>
          <CreateMessageReply
            spaceId={spaceId}
            communityId={communityId}
            setIsInputDialogOpen={setIsInputDialogOpen}
            mId={mId}
          />
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default ReplyInput;
