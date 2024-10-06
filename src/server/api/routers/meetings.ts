import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

import { eq, and } from "drizzle-orm";
import { meetings } from "~/server/db/schema";

export const meetingsRouter = createTRPCRouter({
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

    // get meeting start date/time 
    // date/time is stored as one string and individual date/time must be parsed out 
    getStart: publicProcedure 
        .input(z.object({ 
            groupId: z.number(),
            meetingName: z.string()
        }))
        .query(async ({ ctx, input }) => {
            return await ctx.db 
                .select({ start: meetings.start })
                .from(meetings)
                .where(and(eq(meetings.groupId, input.groupId), eq(meetings.meetingName, input.meetingName)))
        }),

    // change meeting start date/time 
    // must check whether new start date/time is valid 
    changeStart: publicProcedure 
        .input(z.object({
            groupId: z.number(), 
            meetingName: z.string(), 
            newStart: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db 
                .update(meetings) 
                .set({ start: input.newStart })
                .where(and(eq(meetings.groupId, input.groupId), eq(meetings.meetingName, input.meetingName)))
        }),

    // get meeting end date/time 
    // date/time is stored as one string and individual date/time must be parsed out 
    getEnd: publicProcedure 
        .input(z.object({ 
            groupId: z.number(),
            meetingName: z.string()
        }))
        .query(async ({ ctx, input }) => {
            return await ctx.db 
                .select({ end: meetings.end })
                .from(meetings)
                .where(and(eq(meetings.groupId, input.groupId), eq(meetings.meetingName, input.meetingName)))
        }),
    
    // change meeting end date/time 
    // must check whether new start date/time is valid 
    changeEnd: publicProcedure 
        .input(z.object({
            groupId: z.number(), 
            meetingName: z.string(), 
            newEnd: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db 
                .update(meetings) 
                .set({ end: input.newEnd })
                .where(and(eq(meetings.groupId, input.groupId), eq(meetings.meetingName, input.meetingName)))
        }),
    
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
