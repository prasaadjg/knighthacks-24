import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { api } from '~/trpc/react';

const useUserIdStore = () => {
  const { user } = useUser();
  const [userId, setUserId] = useState<number | null>(null);

  // Use TRPC query to fetch user ID by authId, defaulting to user.id
  const foundUserIdData = api.users.getIdFromUId.useQuery({
    authId: user?.id ?? 'user_2n2L7nJm3tiKaJcvQd9VTXvpNjt', // Fallback to the hardcoded ID only if user is not available
  }, {
    enabled: !!user?.id, // Enable the query only if user exists
  });

  useEffect(() => {
    console.log("************");
    console.log(foundUserIdData);

    // Check if data exists and is an array
    const foundUserId = foundUserIdData.data;

    if (foundUserId) {
      // Access the first element of the array and set the userId
      setUserId(foundUserId.id);
      console.log("--**--**--**--**");
      console.log(foundUserId.id); // Correctly accessing the first element's id
    }
  }, [foundUserIdData]); // Use foundUserIdData as a dependency, not user

  return userId;
};

export default useUserIdStore;