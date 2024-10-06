"use client"

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect } from "react";

export default function UserProfile() {
  const { user } = useUser();

  useEffect(() => {
    console.log(user);
    console.log(!user);
    console.log(user?.imageUrl ?? 'hi');
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{user.fullName}</h1>
      <Image src={user.imageUrl} alt="User Avatar" width={100} height={100} className="rounded-full" />
    </div>
  );
}