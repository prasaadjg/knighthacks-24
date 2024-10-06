'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '~/trpc/react';

export default function GroupSettingsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [groupName, setGroupName] = useState('');
  const [groupIcon, setGroupIcon] = useState('');

  const { data: groupData, isLoading: groupLoading } = api.groups.getGroupName.useQuery({ id: Number(id) });

  useEffect(() => {
    if (groupData) {
      setGroupName(groupData.groupName);
      setGroupIcon(groupData.iconUrl);
    }
  }, [groupData]);

  const updateGroupName = api.groups.changeGroupName.useMutation();
  const updateGroupIcon = api.groups.changeIconUrl.useMutation();

  const handleUpdateGroupName = () => {
    updateGroupName.mutate({ id: Number(id), newName: groupName });
  };

  const handleUpdateGroupIcon = () => {
    updateGroupIcon.mutate({ id: Number(id), newUrl: groupIcon });
  };

  if (groupLoading) return <div>Loading group settings...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Group Settings for {groupName}</h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Edit Group Name</h2>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button onClick={handleUpdateGroupName} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          Save Name
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold">Edit Group Icon</h2>
        <input
          type="text"
          value={groupIcon}
          onChange={(e) => setGroupIcon(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button onClick={handleUpdateGroupIcon} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          Save Icon
        </button>
      </div>
      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-end space-x-4">
        <Link href={`/dashboard`}>
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Back to Dashboard
          </button>
        </Link>
        <Link href={`/group/${id}`}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            View Group
          </button>
        </Link>
      </div>
    </div>
  );
}