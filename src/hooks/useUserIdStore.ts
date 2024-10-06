import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { api } from '~/trpc/react';

const useUserIdStore = () => {
  const { user, isSignedIn } = useUser(); // Clerk's hook to check user status
  const [userId, setUserId] = useState<number | null>(null);

  // Mutation to add user to the database
  const addUserToDb = api.users.addUser.useMutation();

  // Query to get the user ID from the DB
  const { data: foundUserIdData } = api.users.getIdFromUId.useQuery(
    {
      authId: user?.id ?? '',
    },
    {
      enabled: !!user?.id && !userId, // Only run if the user is signed in and userId is not already set
    }
  );

  // UseEffect to handle user sign-in and database insertion
  useEffect(() => {
    if (isSignedIn && user && !userId) {
      // Add user to the DB (if they don't exist already)
      addUserToDb.mutate({
        authId: user.id,
        displayName: user.firstName ?? '',
        iconUrl: user.imageUrl,
      });
    }
  }, [isSignedIn, user, userId, addUserToDb]);

  // UseEffect to fetch the user ID from the DB once the data is available
  useEffect(() => {
    if (foundUserIdData) {
      // Assuming foundUserIdData is an array of user data
      setUserId(foundUserIdData.id); // Set the userId if it's found in the DB
    }
  }, [foundUserIdData]);

  return { userId };
};

export default useUserIdStore;