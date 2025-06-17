import { z } from "zod";
import { pgTable, text, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Database schema
export const posters = pgTable('posters', {
  id: text('id').primaryKey(),
  teamName: text('team_name').notNull(),
  imageUrl: text('image_url').notNull(),
  fileType: text('file_type').default('pdf'),
  upvotes: integer('upvotes').default(0),
  downvotes: integer('downvotes').default(0),
  createdAt: timestamp('created_at').defaultNow()
});

export const userVotes = pgTable('user_votes', {
  userId: text('user_id').notNull(),
  posterId: text('poster_id').notNull(),
  voteType: text('vote_type').notNull(), // 'up' or 'down'
  votedAt: timestamp('voted_at').defaultNow(),
}, (table) => {
  return {
    pk: primaryKey(table.userId, table.posterId),
  }
});

// Zod schemas
export const posterSchema = z.object({
  id: z.string(),
  teamName: z.string().min(1, "Team name is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  fileType: z.enum(["image", "pdf"]).default("image"),
  upvotes: z.number().default(0),
  downvotes: z.number().default(0),
  createdAt: z.number()
});

export const userVoteSchema = z.object({
  userId: z.string(),
  posterId: z.string(),
  voteType: z.enum(["up", "down"]),
  votedAt: z.date()
});

export type Poster = z.infer<typeof posterSchema>;
export type UserVote = z.infer<typeof userVoteSchema>;

export const createPosterSchema = posterSchema.omit({ 
  id: true,
  upvotes: true, 
  downvotes: true,
  createdAt: true 
});

export type CreatePoster = z.infer<typeof createPosterSchema>;