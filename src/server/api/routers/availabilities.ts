import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

import { eq, and } from "drizzle-orm";
import { availabilities } from "~/server/db/schema";

export const availabilityRouter = createTRPCRouter({
    // add new availability
    createAvailability: publicProcedure 
        .input(z.object({
            userId: z.number(), 
            groupId: z.number(), 
            start: z.string(), 
            end: z.string(), 
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.insert(availabilities).values({
                userId: input.userId, 
                groupId: input.groupId, 
                start: input.start, 
                end: input.end
            });
        }),


    // get availabilities in a group for a specific user
    getAvailabilities: publicProcedure 
        .input(z.object({ 
            userId: z.number(), 
            groupId: z.number(), 
         }))
         .query(async ({ ctx, input }) => {
            return await ctx.db 
                .select()
                .from(availabilities)
                .where(and(eq(availabilities.userId, input.userId), eq(availabilities.groupId, input.groupId)));
         }),

    // get availability start date/time 
    // date and time are put into one string and must be parsed out
    getStart: publicProcedure 
         .input(z.object({ id: z.number() }))
         .query(async ({ ctx, input }) => {
            return await ctx.db
                .select({ start: availabilities.start })
                .from(availabilities)
                .where(eq(availabilities.id, input.id));
         }),
    
    // change availability start date/time
    changeStart: publicProcedure 
         .input(z.object({
            id: z.number(), 
            newStart: z.string()
         }))
         .mutation(async ({ ctx, input }) => {
            await ctx.db 
                .update(availabilities)
                .set({ start: input.newStart })
                .where(eq(availabilities.id, input.id))
         }),

    // get availability end date/time 
    // date and time are put into one string and must be parsed out
    getEnd: publicProcedure 
         .input(z.object({ id: z.number() }))
         .query(async ({ ctx, input }) => {
            return await ctx.db
                .select({ end: availabilities.end })
                .from(availabilities)
                .where(eq(availabilities.id, input.id));
         }),

    // change availability end date/time
    changeEnd: publicProcedure 
         .input(z.object({
            id: z.number(), 
            newEnd: z.string()
         }))
         .mutation(async ({ ctx, input }) => {
            await ctx.db 
                .update(availabilities)
                .set({ end: input.newEnd })
                .where(eq(availabilities.id, input.id))
         }),     
         
    // delete availability
    deleteAvailability: publicProcedure 
         .input(z.object({ id: z.number() }))
         .mutation(async ({ ctx, input }) => {
            await ctx.db
                .delete(availabilities)
                .where(eq(availabilities.id, input.id))
         }),
})