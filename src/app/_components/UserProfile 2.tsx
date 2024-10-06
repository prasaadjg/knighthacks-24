"use client"

import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function UserProfile() {
  const { user } = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{user.fullName}</h1>
      <Image src={user.imageUrl} alt="User Avatar" />
    </div>
  );
}