"use client";

import { useState } from 'react';
import useUserIdStore from '~/hooks/useUserIdStore';
import { api } from '~/trpc/react';

export default function JoinGroupPage() {
  const userId = useUserIdStore();
  const [groupId, setGroupId] = useState<number>(0);
  const [userColor, setUserColor] = useState<string>('');

  const addMember = api.members.addMember.useMutation({
    onSuccess: () => {
      alert('Successfully joined the group!');
    },
    onError: (error) => {
      console.error('Failed to join the group:', error);
      alert(`Failed to join the group: ${error.message}`);
    },
  });

  const handleJoinGroup = () => {
    if (!userId || groupId <= 0 || !userColor) {
      alert('Please fill in all fields.');
      return;
    }

    addMember.mutate({
      groupId,
      userId,
      userColor,
    });
  };

  return (
    <div>
      <h1>Join a Group</h1>

      <div>
        <label htmlFor="groupId">Group ID:</label>
        <input
          type="number"
          id="groupId"
          value={groupId}
          onChange={(e) => setGroupId(Number(e.target.value))}
          placeholder="Enter Group ID"
        />
      </div>

      <div>
        <label htmlFor="userColor">Choose Your Color:</label>
        <input
          type="text"
          id="userColor"
          value={userColor}
          onChange={(e) => setUserColor(e.target.value)}
          placeholder="Enter Color"
        />
      </div>

      <button onClick={handleJoinGroup}>Join Group</button>
    </div>
  );
}