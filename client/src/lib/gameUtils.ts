import { type Choice, type RoundResult } from "@shared/schema";

export function getChoiceIcon(choice: Choice | null): string {
  switch (choice) {
    case "rock":
      return "back_hand";
    case "paper":
      return "front_hand";
    case "scissors":
      return "content_cut";
    case "lizard":
      return "pets";
    case "spock":
      return "rocket";
    default:
      return "help";
  }
}

export function determineResult(player1Choice: Choice, player2Choice: Choice): RoundResult {
  let winner: 'player1' | 'player2' | 'draw';
  let message: string;

  if (player1Choice === player2Choice) {
    winner = 'draw';
    message = "Both players selected the same move.";
  } else {
    // Define winning combinations
    const winningCombinations: Record<Choice, Choice[]> = {
      rock: ["scissors", "lizard"],
      paper: ["rock", "spock"],
      scissors: ["paper", "lizard"],
      lizard: ["paper", "spock"],
      spock: ["rock", "scissors"]
    };

    // Check if player1's choice beats player2's choice
    if (winningCombinations[player1Choice].includes(player2Choice)) {
      winner = 'player1';
      // Generate appropriate message
      if (player1Choice === "rock") {
        message = player2Choice === "scissors" ? "Rock crushes Scissors" : "Rock crushes Lizard";
      } else if (player1Choice === "paper") {
        message = player2Choice === "rock" ? "Paper covers Rock" : "Paper disproves Spock";
      } else if (player1Choice === "scissors") {
        message = player2Choice === "paper" ? "Scissors cuts Paper" : "Scissors decapitates Lizard";
      } else if (player1Choice === "lizard") {
        message = player2Choice === "paper" ? "Lizard eats Paper" : "Lizard poisons Spock";
      } else {
        message = player2Choice === "rock" ? "Spock vaporizes Rock" : "Spock smashes Scissors";
      }
    } else {
      winner = 'player2';
      // Generate appropriate message for player2's win
      if (player2Choice === "rock") {
        message = player1Choice === "scissors" ? "Rock crushes Scissors" : "Rock crushes Lizard";
      } else if (player2Choice === "paper") {
        message = player1Choice === "rock" ? "Paper covers Rock" : "Paper disproves Spock";
      } else if (player2Choice === "scissors") {
        message = player1Choice === "paper" ? "Scissors cuts Paper" : "Scissors decapitates Lizard";
      } else if (player2Choice === "lizard") {
        message = player1Choice === "paper" ? "Lizard eats Paper" : "Lizard poisons Spock";
      } else {
        message = player1Choice === "rock" ? "Spock vaporizes Rock" : "Spock smashes Scissors";
      }
    }
  }

  return {
    player1Choice,
    player2Choice,
    winner,
    message
  };
}
