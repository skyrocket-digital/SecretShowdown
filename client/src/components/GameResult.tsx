import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getChoiceIcon } from "@/lib/gameUtils";

interface GameResultProps {
  player1Name: string;
  player2Name: string;
  result: any;
  onPlayAgain: () => void;
  onNewGame: () => void;
  isLoading: boolean;
}

export default function GameResult({
  player1Name,
  player2Name,
  result,
  onPlayAgain,
  onNewGame,
  isLoading
}: GameResultProps) {
  // Get the title and message
  const getResultTitle = () => {
    if (result.winner === 'draw') {
      return "It's a Draw!";
    } else if (result.winner === 'player1') {
      return `${player1Name} Wins!`;
    } else {
      return `${player2Name} Wins!`;
    }
  };

  // Get the title color class
  const getTitleClass = () => {
    if (result.winner === 'draw') {
      return "text-muted-foreground";
    } else {
      return "text-green-500";
    }
  };

  return (
    <Card className="p-6 text-center mb-8 max-w-md mx-auto">
      <CardContent className="p-0">
        <h2 className={`text-2xl font-semibold mb-4 ${getTitleClass()}`}>
          {getResultTitle()}
        </h2>
        <p className="text-lg mb-4">{result.message}</p>
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">{player1Name}</p>
            <div className={`w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-muted ${
              result.winner === 'player1' 
                ? "shadow-[0_0_15px_rgba(76,175,80,0.7)] border-2 border-green-500" 
                : result.winner === 'player2' 
                  ? "shadow-[0_0_15px_rgba(176,0,32,0.5)] border-2 border-red-500"
                  : "shadow-[0_0_15px_rgba(158,158,158,0.7)] border-2 border-neutral-500"
            }`}>
              <span className="material-icons text-3xl">
                {getChoiceIcon(result.player1Choice)}
              </span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">{player2Name}</p>
            <div className={`w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-muted ${
              result.winner === 'player2' 
                ? "shadow-[0_0_15px_rgba(76,175,80,0.7)] border-2 border-green-500" 
                : result.winner === 'player1' 
                  ? "shadow-[0_0_15px_rgba(176,0,32,0.5)] border-2 border-red-500"
                  : "shadow-[0_0_15px_rgba(158,158,158,0.7)] border-2 border-neutral-500"
            }`}>
              <span className="material-icons text-3xl">
                {getChoiceIcon(result.player2Choice)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Button 
            className="bg-primary hover:bg-opacity-90 text-white"
            onClick={onPlayAgain}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Next Round"}
          </Button>
          <Button 
            variant="outline"
            className="border-primary text-primary hover:bg-muted"
            onClick={onNewGame}
            disabled={isLoading}
          >
            New Game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
