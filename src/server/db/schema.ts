// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { create } from "domain";
import { sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, integer, text, primaryKey, sqliteTable, foreignKey} from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `knighthacks_24_${name}`);

//example code for posts
//wrote schema
export const posts = createTable(
  "post",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 256 }).notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => ({
    nameIndex: index("name_idx").on(table.name),
  })
);

//user table
export const users = createTable(
  "users",
  {
    //id key (primary)            //primary key implies not null
    id: int("id", {mode: "number"}).primaryKey({autoIncrement: true}),
    //Oauthorization ID
    authId: text("auth_id").unique().notNull(),
    //displayName
    displayName: text("display_name", {length: 25}).notNull(),
    //iconUrl
    iconUrl: text("icon_url").notNull(),
    //time created
    timeCreated: text("time_created").notNull(),
  }
);

// user friends

  export const friends = createTable(
    "friends",
    {
      //references removes needing a foreign key
      userId: int("user_id").references(() => users.id),
      friendId: int("friend_id").references(() => users.id),
    }, (table) => {
      return { 
        //return the primary key of the pair of rows
        pk: primaryKey({ columns: [table.userId, table.friendId] })
      };
    });

// groups table (schedules)

export const groups = createTable(
  "groups", 
  {
    //group id key primary
    id: int("id", {mode: "number"}).primaryKey({autoIncrement: true}),
    //owner id (foreign key referencing user.id) 
    ownerId: int("owner_id", {mode: "number"})
    .notNull()
    .references(() => users.id),
    //group nanme
    groupName: text("group_name", {length: 50}).notNull(),
    start: text("start").notNull(),
    end: text("end").notNull(),
    iconUrl: text("icon_url").notNull(),
  },
);

//for each group; the members in the groups
export const members = createTable(
  "members",
  {
    //group_id -> is the foreign key to the groups id you are at
    groupId: int("group_id", {mode: "number"}).notNull().references(()=>groups.id),
    //user id- > represents the the user
    userId: int("user_id", {mode: "number"}).notNull().references(()=> users.id),
    userColor: text("user_color").notNull()
  }, (table) => {
    return {
      pk: primaryKey({ columns: [table.groupId, table.userId]})
    };
  }
);

//for meetings
export const meetings = createTable(
  'meetings',
  {
    groupId: int("group_id", {mode: "number"}).notNull().references(()=>groups.id),
    meetingName: text("meeting_name", {length: 50}),
    start: text("start"),
    end: text("end"),
  }, (table) => {
    return {
      pk: primaryKey({ columns: [table.groupId, table.meetingName] })
    };
  }
)


// Availabilities
export const availabilities = createTable(
  "availabilities",
  {
    id: int("id", {mode: "number"}).primaryKey({autoIncrement: true}),
    userId: int("user_id", {mode: "number"}).notNull().references(()=>users.id),
    groupId: int("group_id", {mode: "number"}).notNull().references(()=>groups.id),
    start: text("start"),
    end: text("end"),
  }
)

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertFriend = typeof friends.$inferInsert;
export type SelectFriend = typeof friends.$inferSelect;

export type InsertGroup = typeof groups.$inferInsert;
export type SelectGroup = typeof groups.$inferSelect;

export type InsertAvailability = typeof availabilities.$inferInsert;
export type SelectAvailability = typeof availabilities.$inferSelect;

export type InsertMember = typeof members.$inferInsert;
export type SelectMember = typeof members.$inferSelect;

export type InsertMeeting = typeof meetings.$inferInsert;
export type SelectMeeting = typeof meetings.$inferSelect;