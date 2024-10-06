'use client'

import { useState } from "react"
import useUserIdStore from "~/hooks/useUserIdStore";
import { api } from '~/trpc/react';

export default function page() {

  return (
    <div>
      page
      
      <Friends />
    </div>
  )
}

function Friends() {
  const userId = useUserIdStore(); // Get current user's ID from the store
  const [friendId, setFriendId] = useState<number>(-1); // Friend's ID from input
  
  // TRPC mutation for adding a friend
  const addFriend = api.friends.addFriend.useMutation({
    onSuccess: () => {
      alert("Friend added successfully!");
    },
    onError: (error) => {
      console.error("Failed to add friend:", error);
      alert("Failed to add friend.");
    }
  });

  function handleAddFriend() {
    if (friendId > 0 && userId) {
      // Trigger the addFriend mutation
      addFriend.mutate({
        userId: userId,
        friendId: friendId,
      });
    } else {
      alert("Please provide a valid friend ID");
    }
  }

  return (
    <div>
      <h2>Add Friend</h2>

      <div>
        <input 
          type="number" 
          value={friendId} 
          onChange={(e) => setFriendId(parseInt(e.target.value, 10))} 
          placeholder="Enter friend ID"
        />
        <button onClick={handleAddFriend}>Add Friend</button>
      </div>
    </div>
  );
}