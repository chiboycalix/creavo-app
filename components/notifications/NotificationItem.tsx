
export const NotificationItem = ({
  userImage,
  userName,
  action,
  timestamp,
  isFollowing
}: any) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50">
      <div className="flex items-center space-x-3">
        <img
          src={userImage}
          alt={userName}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col">
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-xs">{userName}</span>
            <span className="text-gray-600 text-xs">{action}</span>
          </div>
          <span className="text-xs text-gray-500">{timestamp}</span>
        </div>
      </div>
      {action === 'started following you' && (
        <button
          className={`px-4 py-1 rounded-md text-sm font-medium ${isFollowing
            ? 'bg-gray-100 text-gray-700'
            : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  );
};