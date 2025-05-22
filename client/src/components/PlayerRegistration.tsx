import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface PlayerRegistrationProps {
  onStartGame: (player1Name: string, player2Name: string) => void;
  isLoading: boolean;
}

export default function PlayerRegistration({ onStartGame, isLoading }: PlayerRegistrationProps) {
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const { toast } = useToast();

  const handleStartGame = () => {
    if (!player1Name.trim() || !player2Name.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Both player names are required!"
      });
      return;
    }
    
    onStartGame(player1Name, player2Name);
  };

  return (
    <Card className="bg-card p-6 mb-8 max-w-md mx-auto">
      <CardContent className="p-0">
        <h2 className="text-2xl font-semibold text-primary mb-4">Player Registration</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="player1Name">Player 1 Name</Label>
            <Input 
              type="text" 
              id="player1Name" 
              placeholder="Enter name"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="player2Name">Player 2 Name</Label>
            <Input 
              type="text" 
              id="player2Name" 
              placeholder="Enter name"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
            />
          </div>
          <Button 
            className="w-full" 
            onClick={handleStartGame}
            disabled={isLoading}
          >
            {isLoading ? "Starting Game..." : "Start Game"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
