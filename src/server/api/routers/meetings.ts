import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

import { eq, and } from "drizzle-orm";
import { meetings } from "~/server/db/schema";

export const meetingRouter = createTRPCRouter({
    // create meeting
    createGroup: publicProcedure 
        .input(z.object({
            groupId: z.number(), 
            meetingName: z.string(), 
            start: z.string(), 
            end: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.insert(meetings).values({
                groupId: input.groupId, 
                meetingName: input.meetingName,
                start: input.start, 
                end: input.end,
            });
        }),

    // get all meetings in a group 
    getMeetingsByGroup: publicProcedure 
        .input(z.object({ groupId: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db
                .select()
                .from(meetings) 
                .where(eq(meetings.groupId, input.groupId))
        }),
    
    // get meeting name 
    getMeetingName: publicProcedure
        .input(z.object({ groupId: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db 
                .select({ meetingName: meetings.meetingName })
                .from(meetings)
                .where(eq(meetings.groupId, input.groupId));
        }),
    
    // change meeting name 
    changeMeetingName: publicProcedure 
        .input(z.object({ 
            groupId: z.number(), 
            newName: z.string(), 
         }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db
                .update(meetings)
                .set({ meetingName: input.newName })
                .where(eq(meetings.groupId, input.groupId));
        }),

    // get meeting dates -- returns start date and end date 
    // TODO: figure out how to parse date from input

    // TODO: change meeting dates
        // check that they fit within group constraints

    // TODO: get meeting times
    
    // TODO: edit meeting times
        // chekc that they fit within group constaints
    
    // delete meeting 
    deleteMeeting: publicProcedure
        .input(z.object({ 
            groupId: z.number(), 
            meetingName: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db 
                .delete(meetings)
                .where(and(eq(meetings.groupId, input.groupId), eq(meetings.meetingName, input.meetingName)));
        }),
})
