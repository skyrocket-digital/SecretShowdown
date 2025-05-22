import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table definition
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Game model definitions
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  player1Id: integer("player1_id").notNull(),
  player2Id: integer("player2_id").notNull(),
  player1Score: integer("player1_score").notNull().default(0),
  player2Score: integer("player2_score").notNull().default(0),
  currentRound: integer("current_round").notNull().default(1),
  active: boolean("active").notNull().default(true),
});

export const gameRounds = pgTable("game_rounds", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull(),
  roundNumber: integer("round_number").notNull(),
  player1Choice: text("player1_choice"),
  player2Choice: text("player2_choice"),
  winner: text("winner"), // 'player1', 'player2', or 'draw'
  completed: boolean("completed").notNull().default(false),
});

// Zod schemas for insertion
export const insertGameSchema = createInsertSchema(games).pick({
  player1Id: true,
  player2Id: true,
});

export const insertRoundSchema = createInsertSchema(gameRounds).pick({
  gameId: true,
  roundNumber: true,
});

// Choice schema
export const choiceSchema = z.enum(["rock", "paper", "scissors"]);

// Player choice schema
export const playerChoiceSchema = z.object({
  gameId: z.number(),
  playerId: z.number(),
  choice: choiceSchema,
  roundNumber: z.number(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

export type InsertRound = z.infer<typeof insertRoundSchema>;
export type GameRound = typeof gameRounds.$inferSelect;

export type Choice = z.infer<typeof choiceSchema>;
export type PlayerChoice = z.infer<typeof playerChoiceSchema>;

// Game types for frontend
export type GameState = {
  id: number;
  player1: PlayerState;
  player2: PlayerState;
  currentRound: number;
  status: 'registration' | 'player1-turn' | 'player2-turn' | 'result' | 'completed';
};

export type PlayerState = {
  id: number | null;
  name: string;
  score: number;
  choice: Choice | null;
};

export type RoundResult = {
  player1Choice: Choice;
  player2Choice: Choice;
  winner: 'player1' | 'player2' | 'draw';
  message: string;
};
