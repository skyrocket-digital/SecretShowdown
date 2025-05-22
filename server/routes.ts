import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { choiceSchema, playerChoiceSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new game
  app.post("/api/games", async (req, res) => {
    try {
      const schema = z.object({
        player1Name: z.string().min(1).max(30),
        player2Name: z.string().min(1).max(30),
      });
      
      const { player1Name, player2Name } = schema.parse(req.body);
      
      const game = await storage.createGame(player1Name, player2Name);
      
      res.status(201).json(game);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Failed to create game" });
      }
    }
  });

  // Get game by id
  app.get("/api/games/:id", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      if (isNaN(gameId)) {
        return res.status(400).json({ error: "Invalid game ID" });
      }
      
      const game = await storage.getGame(gameId);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      
      res.json(game);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch game" });
    }
  });

  // Submit a player's choice
  app.post("/api/games/:id/choices", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      if (isNaN(gameId)) {
        return res.status(400).json({ error: "Invalid game ID" });
      }
      
      const game = await storage.getGame(gameId);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      
      const schema = z.object({
        playerId: z.number(),
        choice: choiceSchema,
        roundNumber: z.number()
      });
      
      const { playerId, choice, roundNumber } = schema.parse(req.body);
      
      // Validate player is part of the game
      if (playerId !== game.player1Id && playerId !== game.player2Id) {
        return res.status(403).json({ error: "Player is not part of this game" });
      }
      
      // Submit the choice
      await storage.submitChoice(gameId, roundNumber, playerId, choice);
      
      // Get updated round
      const round = await storage.getRound(gameId, roundNumber);
      
      // Return choice confirmation, but not the opponent's choice
      res.json({
        gameId,
        roundNumber,
        playerId,
        submitted: true,
        roundComplete: round?.completed || false
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
      } else if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to submit choice" });
      }
    }
  });

  // Get round result (only if both players have submitted choices)
  app.get("/api/games/:id/rounds/:roundNumber/result", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      const roundNumber = parseInt(req.params.roundNumber);
      
      if (isNaN(gameId) || isNaN(roundNumber)) {
        return res.status(400).json({ error: "Invalid game ID or round number" });
      }
      
      const round = await storage.getRoundResult(gameId, roundNumber);
      
      if (!round) {
        return res.status(404).json({ error: "Round result not available yet" });
      }
      
      // Get updated game for scores
      const game = await storage.getGame(gameId);
      
      // Return result
      res.json({
        gameId,
        roundNumber,
        player1Choice: round.player1Choice,
        player2Choice: round.player2Choice,
        winner: round.winner,
        player1Score: game?.player1Score || 0,
        player2Score: game?.player2Score || 0
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch round result" });
    }
  });

  // Start next round
  app.post("/api/games/:id/nextRound", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      if (isNaN(gameId)) {
        return res.status(400).json({ error: "Invalid game ID" });
      }
      
      const game = await storage.getGame(gameId);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      
      // Start a new round
      const nextRound = game.currentRound + 1;
      const updatedGame = await storage.updateGameRound(gameId, nextRound);
      
      res.json({
        gameId,
        currentRound: updatedGame.currentRound
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to start next round" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
