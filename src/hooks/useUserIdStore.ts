import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { api } from '~/trpc/react';

const useUserIdStore = () => {
  const { user, isSignedIn } = useUser(); // Clerk's hook to check user status

  const addUserToDb = api.users.addUser.useMutation(); // TRPC mutation to add user

  useEffect(() => {
    if (isSignedIn && user) {
      // Trigger the mutation to push user data to the database
      addUserToDb.mutate({
        authId: user.id,
        displayName: user.firstName ?? '',
        iconUrl: user.imageUrl,
      });
    }
  }, [isSignedIn, user]);

  return { userId: user?.id };
};

export default useUserIdStore;