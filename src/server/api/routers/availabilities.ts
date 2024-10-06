import { db } from "~/server/db";
import { eq, and } from "drizzle-orm";
import { availabilities, SelectUser, SelectGroup } from "~/server/db/schema";

// get availabilities for a user in a group (based on userId + groupId -- findMany)
export async function getAvailabilities(userId: SelectUser['id'], groupId: SelectGroup['id'])
{
    return db 
        .select()
        .from(availabilities)
        .where(and(eq(availabilities.userId, userId), eq(availabilities.groupId, groupId)));
}

// update user availability (add new availability) -- one at a time
    // check existing availabilities in db, if they contain any hours in the new availability, delete existing one  
    // after all that, add new availability
// TODO: do this once you figure out how to parse out the time :)


// export async function addAvailability() {

// }

// TODO: delete availability (used for updating availability)
// only affects availabilities table
    // (availabilities not referenced in other tables)
