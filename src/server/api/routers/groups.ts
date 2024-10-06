import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

import { eq } from "drizzle-orm";
import { groups } from "~/server/db/schema";

export const groupRouter = createTRPCRouter({
    // create new group
    createGroup: publicProcedure 
        .input(z.object({
            id: z.number(), 
            ownerId: z.number(), 
            groupName: z.string(), 
            start: z.string(), 
            end: z.string(), 
            iconUrl: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.insert(groups).values({
                id: input.id, 
                ownerId: input.ownerId, 
                groupName: input.groupName, 
                start: input.start, 
                end: input.end, 
                iconUrl: input.iconUrl,
            });
        }),
    
    // get group name
    getGroupName: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db
                .select({ groupName: groups.groupName })
                .from(groups)
                .where(eq(groups.id, input.id))
        }),

    // change group name
    changeGroupName: publicProcedure
        .input(z.object({
            id: z.number(), 
            newName: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db 
                .update(groups)
                .set({ groupName: input.newName })
                .where(eq(groups.id, input.id));
        }),
    
    // get group icon URL
    getIconUrl: publicProcedure 
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db
                .select({ iconUrl: groups.iconUrl })
                .from(groups)
                .where(eq(groups.id, input.id))
        }),  
    
    // change group icon
    changeIconUrl: publicProcedure 
        .input(z.object({
            id: z.number(), 
            newUrl: z.string(), 
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db 
                .update(groups)
                .set({ iconUrl: input.newUrl })
                .where(eq(groups.id, input.id));
        }),

    // get group owner
    getOwner: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db
                .select({ ownerId: groups.ownerId })
                .from(groups)
                .where(eq(groups.id, input.id));
        }),
    
    // change group owner
    changeOwner: publicProcedure
        .input(z.object({
            id: z.number(), 
            newOwnerId: z.number(), 
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db
                .update(groups)
                .set({ ownerId: input.newOwnerId })
                .where(eq(groups.id, input.id));
        }),
    
    // get group dates -- returns start date and end date 
    // TODO: figure out how to parse date from input

    // TODO: change group dates
        // deletes availabilities that can no longer be shown (availabilities outside the date)
        // note: availabilities are already separated by day, so no updating needed (multi-day availability is alr. split up)
        
    // TODO: get group times 

    // TODO: edit group times
        // deletes/updates availabilities affected by this change
            // updates if there are parts still within schedule dates (updates to current start/end depending on what gets cut off)
            // deletes if it is fully outside group times/dates

    // TODO: delete group
})