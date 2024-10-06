'use client';

import { useUser } from "@clerk/clerk-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useUserIdStore from "~/hooks/useUserIdStore";
import { api } from "~/trpc/react";

export default function ProfilePage() {
  const { user } = useUser();
  const userId = useUserIdStore();
  const [groups, setGroups] = useState<any[]>([]);

  const { data: groupsData, isLoading: groupsLoading } = api.members.getGroupsByUser.useQuery(
    { userId: userId ?? 0 },
    {
      enabled: !!userId,
    }
  );

  useEffect(() => {
    if (groupsData) {
      setGroups(groupsData);
    }
  }, [groupsData]);

  return (
    <div className="p-8 bg-blue-100 min-h-screen flex flex-col items-center">
      {/* Profile Section */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mb-6 text-center">
        <h1 className="text-3xl font-bold mb-4">{user?.fullName}</h1>
        <p className="text-lg mb-2">Username: {user?.username}</p>
        <p className="text-gray-700">User Auth ID: {user?.id}</p>
        <p className="text-gray-700">User DB ID: {userId}</p>
      </div>

      {/* Groups Section */}
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

      {/* Links Section */}
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