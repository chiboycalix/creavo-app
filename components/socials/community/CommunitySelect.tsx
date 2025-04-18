import { useState } from 'react';

interface Community {
  id: string;
  name: string;
  logo?: string;
}

interface CommunitySelectProps {
  communities: any[];
  selectedCommunity: Community | null;
  onSelect: (community: Community) => void;
}

const CommunitySelect: React.FC<CommunitySelectProps> = ({
  communities,
  selectedCommunity,
  onSelect
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!communities?.length) {
    return <div className="text-gray-500">No communities available</div>;
  }

  return (
    <div className="w-full">
      <div className="relative">
        <div
          className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedCommunity ? (
            <>
              <img
                src={selectedCommunity.logo || '/assets/community.svg'}
                alt="Community Avatar"
                className="rounded-full h-10 w-10 object-cover"
              />
              <span className="text-sm font-semibold text-black">
                {selectedCommunity.name}
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-500">Select a community</span>
          )}
          <svg
            className={`ml-auto h-5 w-5 transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {communities.map((community) => (
              <div
                key={community.id}
                className="flex items-center space-x-2 p-4 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onSelect(community);
                  setIsOpen(false);
                }}
              >
                <img
                  src={community.logo || '/assets/community.svg'}
                  alt="Community Avatar"
                  className="rounded-full h-10 w-10 object-cover"
                />
                <span className="text-sm font-semibold text-black">
                  {community.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunitySelect;