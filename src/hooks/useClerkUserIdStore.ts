import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { api } from '~/trpc/react';

const useUserIdStore = () => {
  const { user } = useUser();
  const [userId, setUserId] = useState<number | null>(null);

  const foundUserId = api.users.getIdFromUId.useQuery({
    authId: user?.id ?? '',
  }, {
    enabled: !!user?.id,
  }).data;

  useEffect(() => {
    console.log("change-------");
    if (foundUserId) {
      setUserId(foundUserId.id)
    }
  }, [foundUserId]);

  return userId;
};

// const { data: userIdData, isLoading, error } = api.users.getIdFromUId.useQuery({
//   authId: user?.id ?? '',
// });

export default useUserIdStore;