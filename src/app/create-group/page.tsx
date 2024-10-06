'use client'

import { useState } from 'react';
import useUserIdStore from '~/hooks/useUserIdStore';
import { api } from '~/trpc/react';

export default function CreateGroupPage() {
  const userId = useUserIdStore();
  const [groupName, setGroupName] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [iconUrl, setIconUrl] = useState('');

  const createGroup = api.groups.createGroup.useMutation({
    onSuccess: () => {
      alert('Group created successfully!');
    },
    onError: (error) => {
      console.error('Error creating group:', error);
      alert('Failed to create group.');
    },
  });

  const handleCreateGroup = () => {
    if (userId && groupName && start && end && iconUrl) {
      createGroup.mutate({
        ownerId: userId,
        groupName,
        start,
        end,
        iconUrl,
      });
    } else {
      alert('Please fill out all fields');
    }
  };

  return (
    <div>
      <h2>Create a New Group</h2>

      <div>
        <label>Group Name:</label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
        />
      </div>

      <div>
        <label>Start Date/Time:</label>
        <input
          type="text"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="Enter start time (e.g., YYYY-MM-DD HH:MM)"
        />
      </div>

      <div>
        <label>End Date/Time:</label>
        <input
          type="text"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          placeholder="Enter end time (e.g., YYYY-MM-DD HH:MM)"
        />
      </div>

      <div>
        <label>Icon URL:</label>
        <input
          type="text"
          value={iconUrl}
          onChange={(e) => setIconUrl(e.target.value)}
          placeholder="Enter icon URL"
        />
      </div>

      <button onClick={handleCreateGroup}>Create Group</button>
    </div>
  );
}