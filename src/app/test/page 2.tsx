"use client"

import { api } from "~/trpc/react";

export default function page() {

  return (
    <div className="p-2">
      <h1 className="text-4xl pb-4">Users Fetch</h1>

      <UsersFetch />

    </div>
  )
}

function UsersFetch() {
  const users = api.user.getAll.useQuery().data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

      {users?.map((user) => (
        <div key={user.id} className="bg-blue-400 p-2 rounded-lg m-4">

          <h1 className="text-xl">{user.displayName}</h1>
          <div className="pl-2">
            <div>
              Time created: {user.timeCreated}
            </div>
          </div>

        </div>
      ))}

    </div>
  )
}