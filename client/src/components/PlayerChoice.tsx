import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getChoiceIcon } from "@/lib/gameUtils";
import { type Choice } from "@shared/schema";

interface PlayerChoiceProps {
  playerName: string;
  playerId: number;
  isSelected: boolean;
  isRevealed: boolean;
  choice: Choice | null;
  winner: 'player1' | 'player2' | 'draw' | null;
  playerKey: 'player1' | 'player2';
  onSelectChoice: (playerId: number, choice: Choice) => void;
  disabled: boolean;
}

export default function PlayerChoice({
  playerName,
  playerId,
  isSelected,
  isRevealed,
  choice,
  winner,
  playerKey,
  onSelectChoice,
  disabled
}: PlayerChoiceProps) {
  // CSS classes for the choice reveal
  const getCardClasses = () => {
    if (!isRevealed) return "";
    
    if (winner === 'draw') {
      return "shadow-[0_0_20px_rgba(158,158,158,0.7)] border-[3px] border-neutral";
    } else if (
      (winner === 'player1' && playerKey === 'player1') || 
      (winner === 'player2' && playerKey === 'player2')
    ) {
      return "shadow-[0_0_20px_rgba(76,175,80,0.7)] border-[3px] border-success";
    } else {
      return "shadow-[0_0_20px_rgba(176,0,32,0.5)] border-[3px] border-destructive";
    }
  };

  const handleChoiceClick = (choice: Choice) => {
    if (!disabled) {
      onSelectChoice(playerId, choice);
    }
  };

  return (
    <Card className={`p-6 w-full md:w-80 transition-all ${getCardClasses()}`}>
      <CardContent className="p-0">
        <h2 className="text-xl font-semibold text-primary mb-4">
          {playerName}'s Choice
        </h2>
        
        {/* Hidden player choice display (revealed later) */}
        {isRevealed && (
          <div className="mb-6 flex justify-center">
            <div className="animate-reveal w-24 h-24 flex items-center justify-center rounded-full bg-muted">
              <span className="material-icons text-5xl text-primary">
                {getChoiceIcon(choice)}
              </span>
            </div>
          </div>
        )}

        {/* Choice selection section */}
        {!isSelected && (
          <div>
            <p className="text-sm text-muted-foreground mb-4">Select your move:</p>
            <div className="grid grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center p-3 h-auto border-2 hover:bg-muted hover:scale-105 transition-all"
                onClick={() => handleChoiceClick("rock")}
                disabled={disabled}
              >
                <span className="material-icons text-3xl mb-1">back_hand</span>
                <span className="text-sm">Rock</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center p-3 h-auto border-2 hover:bg-muted hover:scale-105 transition-all"
                onClick={() => handleChoiceClick("paper")}
                disabled={disabled}
              >
                <span className="material-icons text-3xl mb-1">front_hand</span>
                <span className="text-sm">Paper</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center p-3 h-auto border-2 hover:bg-muted hover:scale-105 transition-all"
                onClick={() => handleChoiceClick("scissors")}
                disabled={disabled}
              >
                <span className="material-icons text-3xl mb-1">content_cut</span>
                <span className="text-sm">Scissors</span>
              </Button>
            </div>
          </div>
        )}

        {/* Choice made indicator */}
        {isSelected && !isRevealed && (
          <div className="text-center mt-4 py-3 bg-muted rounded-lg">
            <p className="text-primary font-medium">
              <span className="material-icons align-middle mr-1">check_circle</span>
              Choice made!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
