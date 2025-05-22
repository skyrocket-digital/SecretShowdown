import { 
  users, 
  type User, 
  type InsertUser, 
  type Game, 
  type InsertGame, 
  type GameRound, 
  type InsertRound, 
  type Choice 
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game methods
  createGame(player1Name: string, player2Name: string): Promise<Game>;
  getGame(id: number): Promise<Game | undefined>;
  updateGameScore(id: number, player1Score: number, player2Score: number): Promise<Game>;
  updateGameRound(id: number, roundNumber: number): Promise<Game>;
  
  // Round methods
  createRound(gameId: number, roundNumber: number): Promise<GameRound>;
  getRound(gameId: number, roundNumber: number): Promise<GameRound | undefined>;
  submitChoice(gameId: number, roundNumber: number, playerId: number, choice: Choice): Promise<boolean>;
  getRoundResult(gameId: number, roundNumber: number): Promise<GameRound | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private gameRounds: Map<string, GameRound>;
  private userCurrentId: number;
  private gameCurrentId: number;
  private roundCurrentId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.gameRounds = new Map();
    this.userCurrentId = 1;
    this.gameCurrentId = 1;
    this.roundCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Game methods
  async createGame(player1Name: string, player2Name: string): Promise<Game> {
    // Create or get players
    let player1 = await this.getUserByUsername(player1Name);
    if (!player1) {
      player1 = await this.createUser({ username: player1Name, password: "password" });
    }
    
    let player2 = await this.getUserByUsername(player2Name);
    if (!player2) {
      player2 = await this.createUser({ username: player2Name, password: "password" });
    }

    const gameId = this.gameCurrentId++;
    const game: Game = {
      id: gameId,
      player1Id: player1.id,
      player2Id: player2.id,
      player1Score: 0,
      player2Score: 0,
      currentRound: 1,
      active: true
    };
    
    this.games.set(gameId, game);
    
    // Create first round
    await this.createRound(gameId, 1);
    
    return game;
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async updateGameScore(id: number, player1Score: number, player2Score: number): Promise<Game> {
    const game = this.games.get(id);
    if (!game) {
      throw new Error(`Game with id ${id} not found`);
    }
    
    const updatedGame = {
      ...game,
      player1Score,
      player2Score
    };
    
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  async updateGameRound(id: number, roundNumber: number): Promise<Game> {
    const game = this.games.get(id);
    if (!game) {
      throw new Error(`Game with id ${id} not found`);
    }
    
    const updatedGame = {
      ...game,
      currentRound: roundNumber
    };
    
    this.games.set(id, updatedGame);
    
    // Create a new round
    await this.createRound(id, roundNumber);
    
    return updatedGame;
  }

  // Round methods
  async createRound(gameId: number, roundNumber: number): Promise<GameRound> {
    const roundId = this.roundCurrentId++;
    const roundKey = `${gameId}-${roundNumber}`;
    
    const round: GameRound = {
      id: roundId,
      gameId,
      roundNumber,
      player1Choice: null,
      player2Choice: null,
      winner: null,
      completed: false
    };
    
    this.gameRounds.set(roundKey, round);
    return round;
  }

  async getRound(gameId: number, roundNumber: number): Promise<GameRound | undefined> {
    const roundKey = `${gameId}-${roundNumber}`;
    return this.gameRounds.get(roundKey);
  }

  async submitChoice(gameId: number, roundNumber: number, playerId: number, choice: Choice): Promise<boolean> {
    const roundKey = `${gameId}-${roundNumber}`;
    const round = this.gameRounds.get(roundKey);
    
    if (!round) {
      throw new Error(`Round ${roundNumber} not found for game ${gameId}`);
    }
    
    const game = await this.getGame(gameId);
    if (!game) {
      throw new Error(`Game with id ${gameId} not found`);
    }
    
    if (playerId === game.player1Id) {
      round.player1Choice = choice;
    } else if (playerId === game.player2Id) {
      round.player2Choice = choice;
    } else {
      throw new Error(`Player ${playerId} is not part of game ${gameId}`);
    }
    
    // Check if both players have submitted choices
    if (round.player1Choice && round.player2Choice) {
      round.completed = true;
      
      // Determine winner
      if (round.player1Choice === round.player2Choice) {
        round.winner = "draw";
      } else if (
        (round.player1Choice === "rock" && round.player2Choice === "scissors") ||
        (round.player1Choice === "paper" && round.player2Choice === "rock") ||
        (round.player1Choice === "scissors" && round.player2Choice === "paper")
      ) {
        round.winner = "player1";
        await this.updateGameScore(gameId, game.player1Score + 1, game.player2Score);
      } else {
        round.winner = "player2";
        await this.updateGameScore(gameId, game.player1Score, game.player2Score + 1);
      }
    }
    
    this.gameRounds.set(roundKey, round);
    return true;
  }

  async getRoundResult(gameId: number, roundNumber: number): Promise<GameRound | undefined> {
    const round = await this.getRound(gameId, roundNumber);
    if (!round || !round.completed) {
      return undefined;
    }
    return round;
  }
}

export const storage = new MemStorage();
