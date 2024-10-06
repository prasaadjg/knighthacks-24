'use client';

import { useUser } from "@clerk/clerk-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useUserIdStore from "~/hooks/useUserIdStore";
import { api } from "~/trpc/react";

export default function ProfilePage() {
  const { isSignedIn, user } = useUser();
  const userId = useUserIdStore();
  const [groups, setGroups] = useState<any[]>([]);
  const [userAdded, setUserAdded] = useState(false);

  const { data: groupsData, isLoading: groupsLoading } = api.members.getGroupsByUser.useQuery(
    { userId: userId ?? 0 },
    {
      enabled: !!userId,
    }
  );

  const addUserToDb = api.users.addUser.useMutation({
    onSuccess: () => {
      setUserAdded(true);
    },
  });

  const handleAddUser = () => {
    if (user) {
      console.log(user);
      addUserToDb.mutate({
        authId: user.id,
        displayName: user.fullName ?? 'Unknown User',
        iconUrl: user.imageUrl ?? '',
      });
    }
  };

  useEffect(() => {
    if (groupsData) {
      setGroups(groupsData);
    }
    if (!userId && isSignedIn) {
      setUserAdded(false);
    } else {
      setUserAdded(true);
    }
  }, [groupsData, userId, isSignedIn]);

  return (
    <div className="p-8 bg-blue-100 min-h-screen flex flex-col items-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mb-6 text-center">
        <h1 className="text-3xl font-bold mb-4">{user?.firstName}</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>
        {groupsLoading ? (
          <p>Loading groups...</p>
        ) : groups.length > 0 ? (
          <ul>
            {groups.map((group) => (
              <li key={group.groupId} className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-lg font-medium">{group.groupName}</p>
                  <p className="text-sm text-gray-600">Group ID: {group.groupId}</p>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/schedule/${group.groupId}`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Join Group
                    </button>
                  </Link>
                  <Link href={`/group-settings/${group.groupId}`}>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                      Settings
                    </button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>You are not in any groups.</p>
        )}
      </div>

      {isSignedIn && !userAdded && (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mb-6 text-center">
          <button
            onClick={handleAddUser}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add yourself to the database
          </button>
        </div>
      )}

      <div className="w-full max-w-lg">
        <Link href={'/'}>
          <button className="w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}