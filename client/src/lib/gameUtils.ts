import { type Choice, type RoundResult } from "@shared/schema";

export function getChoiceIcon(choice: Choice | null): string {
  switch (choice) {
    case "rock":
      return "back_hand";
    case "paper":
      return "front_hand";
    case "scissors":
      return "content_cut";
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
  } else if (
    (player1Choice === "rock" && player2Choice === "scissors") ||
    (player1Choice === "paper" && player2Choice === "rock") ||
    (player1Choice === "scissors" && player2Choice === "paper")
  ) {
    winner = 'player1';
    
    if (player1Choice === "rock") {
      message = "Rock crushes Scissors";
    } else if (player1Choice === "paper") {
      message = "Paper covers Rock";
    } else {
      message = "Scissors cuts Paper";
    }
  } else {
    winner = 'player2';
    
    if (player2Choice === "rock") {
      message = "Rock crushes Scissors";
    } else if (player2Choice === "paper") {
      message = "Paper covers Rock";
    } else {
      message = "Scissors cuts Paper";
    }
  }

  return {
    player1Choice,
    player2Choice,
    winner,
    message
  };
}
