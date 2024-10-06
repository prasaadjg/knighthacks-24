import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

import { eq, and } from "drizzle-orm";
import { availabilities } from "~/server/db/schema";

export const availabilityRouter = createTRPCRouter({
    // TODO: add new availability
        // check existing availabilities; if they contain hours in new availability, delete them 
        // after all that, add new availability

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
    
    // delete availability
    deleteAvailability: publicProcedure 
         .input(z.object({ id: z.number() }))
         .mutation(async ({ ctx, input }) => {
            await ctx.db
                .delete(availabilities)
                .where(eq(availabilities.id, input.id))
         }),
})