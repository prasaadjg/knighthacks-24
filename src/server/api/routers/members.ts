import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { members, SelectUser, SelectGroup, InsertMember } from "~/server/db/schema";

// get all groups a user is in (by userId) 
export async function getGroupsByUser(userId: SelectUser['id']): Promise<
    Array<{ groupId: number }>
>{
    return db
        .select({ groupId: members.groupId })
        .from(members)
        .where(eq(members.userId, userId));
}

// get all users in a group (by groupId)
    // TODO: have ability to filter out certain members (used for showing availabilities on calendar)
export async function getUsersByGroup(groupId: SelectGroup['id']): Promise<
    Array<{ userId: number }>
>{
    return db 
        .select({ userId: members.userId })
        .from(members)
        .where(eq(members.groupId, groupId));
}

// add member (join group)
export async function createMember(data: InsertMember) {
    await db.insert(members).values(data);
}


// TODO: delete member (leave group)