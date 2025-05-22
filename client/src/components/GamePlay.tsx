import { useState, useEffect } from "react";
import ScoreBoard from "./ScoreBoard";
import PlayerChoice from "./PlayerChoice";
import GameResult from "./GameResult";
import { type GameState, type Choice } from "@shared/schema";

interface GamePlayProps {
  gameState: GameState;
  roundResult: any;
  onMakeChoice: (playerId: number, choice: Choice) => void;
  onNextRound: () => void;
  onNewGame: () => void;
  isLoading: boolean;
}

export default function GamePlay({ 
  gameState, 
  roundResult, 
  onMakeChoice, 
  onNextRound, 
  onNewGame,
  isLoading
}: GamePlayProps) {
  // Track if a player has made their selection
  const [player1Selected, setPlayer1Selected] = useState(false);
  const [player2Selected, setPlayer2Selected] = useState(false);

  // Reset selections when round changes
  useEffect(() => {
    setPlayer1Selected(gameState.player1.choice !== null);
    setPlayer2Selected(gameState.player2.choice !== null);
  }, [gameState.currentRound, gameState.player1.choice, gameState.player2.choice]);

  const handleChoice = (playerId: number, choice: Choice) => {
    onMakeChoice(playerId, choice);
    
    if (playerId === gameState.player1.id) {
      setPlayer1Selected(true);
    } else if (playerId === gameState.player2.id) {
      setPlayer2Selected(true);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 justify-center mb-8">
        <ScoreBoard 
          player1Name={gameState.player1.name}
          player2Name={gameState.player2.name}
          player1Score={gameState.player1.score}
          player2Score={gameState.player2.score}
          currentRound={gameState.currentRound}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-center mb-8">
        <PlayerChoice 
          playerName={gameState.player1.name}
          playerId={gameState.player1.id!}
          isSelected={player1Selected}
          isRevealed={!!roundResult}
          choice={roundResult ? roundResult.player1Choice : null}
          winner={roundResult?.winner}
          playerKey="player1"
          onSelectChoice={handleChoice}
          disabled={player1Selected || isLoading}
        />

        {/* VS Indicator for desktop */}
        <div className="hidden md:flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground font-bold text-lg">VS</span>
          </div>
        </div>

        {/* VS Indicator for mobile */}
        <div className="flex md:hidden items-center justify-center my-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground font-bold text-lg">VS</span>
          </div>
        </div>

        <PlayerChoice 
          playerName={gameState.player2.name}
          playerId={gameState.player2.id!}
          isSelected={player2Selected}
          isRevealed={!!roundResult}
          choice={roundResult ? roundResult.player2Choice : null}
          winner={roundResult?.winner}
          playerKey="player2"
          onSelectChoice={handleChoice}
          disabled={player2Selected || isLoading}
        />
      </div>

      {roundResult && (
        <GameResult 
          player1Name={gameState.player1.name}
          player2Name={gameState.player2.name}
          result={roundResult}
          onPlayAgain={onNextRound}
          onNewGame={onNewGame}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
