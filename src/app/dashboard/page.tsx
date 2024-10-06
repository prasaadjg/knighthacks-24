'use client'

import { useAuth, useUser } from "@clerk/clerk-react"
import { clerkClient } from "@clerk/nextjs/server";
import { useEffect, useState } from "react";
import useUserIdStore from "~/hooks/userIdStore";
import { api } from "~/trpc/react"

export default function page() {
  const { user } = useUser();
  const userId = useUserIdStore();

  useEffect(() => {
    console.log('id');
    console.log(userId);
    console.log('user:', user);
  });

  return (
    <div className="p-4 bg-blue-400 h-screen w-screen">
      <h1>{user?.fullName}</h1>
      <h1>Username: {user?.username}</h1>
      <div>User Auth ID: {user?.id}</div>
      <div>User ID: {userId}</div>
    </div>
  )
}