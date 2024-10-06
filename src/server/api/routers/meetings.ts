import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { meetings, SelectMeeting, InsertMeeting, SelectGroup } from "~/server/db/schema";

// create meeting (only allowed for group owner)
export async function createMeeting(data: InsertMeeting) {
    await db.insert(meetings).values(data);
}

// get all meetings under a group (by groupId)
export async function getMeetings(groupId: SelectGroup['id'])
{
    return db.select().from(meetings).where(eq(meetings.groupId, groupId));
}

// get meeting name (query)
export async function getMeetingName(groupId: SelectGroup['id'])
{
    return db
        .select({ meetingName: meetings.meetingName })
        .from(meetings)
        .where(eq(meetings.groupId, groupId));
}

// change meeting name (update)
export async function changeMeetingName(groupId: SelectGroup['id'], newName: Partial<Pick<SelectMeeting, 'meetingName'>>) {
    await db.update(meetings).set(newName).where(eq(meetings.groupId, groupId));
}

// get meeting dates (returns both start_date and end_date)
// TODO: figure out how to format dates correctly before implementing (test w/ groups)


// edit meeting dates 
    // takes in new start_date and end_date, updates them
// TODO: figure out how to format dates correctly before implementing (test w/ groups)    

// get meeting times (returns both start_time and end_time)
// TODO: figure out how to format dates correctly before implementing (test w/ groups)

// edit meeting times
    // takes in new start_time and end_time, updates them 
// TODO: figure out how to format dates correctly before implementing (test w/ groups)

// TODO: delete meeting
// only affects meetings table 
