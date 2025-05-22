import { useState } from "react";
import PlayerRegistration from "@/components/PlayerRegistration";
import GamePlay from "@/components/GamePlay";
import GameInstructions from "@/components/GameInstructions";
import { useGame } from "@/hooks/useGame";

export default function GamePage() {
  const { 
    gameState, 
    startGame, 
    makeChoice, 
    startNextRound, 
    resetGame, 
    roundResult, 
    isCreatingGame,
    isSubmittingChoice,
    isStartingNextRound
  } = useGame();
  
  // Game status message
  const getGameStatus = () => {
    if (gameState.status === "registration") {
      return "Select your players and make your choices!";
    } else if (gameState.status === "result" && roundResult) {
      return `Round ${gameState.currentRound} results are in!`;
    } else {
      return `Round ${gameState.currentRound}: Make your selections!`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Rock Paper Scissors
        </h1>
        <p className="text-muted-foreground text-lg">{getGameStatus()}</p>
      </header>

      <div className="relative">
        {gameState.status === "registration" ? (
          <PlayerRegistration onStartGame={startGame} isLoading={isCreatingGame} />
        ) : (
          <GamePlay 
            gameState={gameState}
            onMakeChoice={makeChoice}
            onNextRound={startNextRound}
            onNewGame={resetGame}
            roundResult={roundResult}
            isLoading={isSubmittingChoice || isStartingNextRound}
          />
        )}

        <GameInstructions />
      </div>
    </div>
  );
}
