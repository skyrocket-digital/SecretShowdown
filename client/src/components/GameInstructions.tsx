import { Card, CardContent } from "@/components/ui/card";

export default function GameInstructions() {
  return (
    <Card className="p-6 mb-8 max-w-lg mx-auto">
      <CardContent className="p-0">
        <h2 className="text-xl font-semibold text-primary mb-4">How to Play</h2>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
          <li>Enter both player names and click "Start Game"</li>
          <li>Each player secretly selects rock, paper, scissors, lizard, or spock</li>
          <li>After both players have chosen, the selections are revealed</li>
          <li>Winner is determined by the following rules:
            <ul className="list-disc pl-5 mt-1 text-sm">
              <li>Rock crushes Scissors and Lizard</li>
              <li>Paper covers Rock and disproves Spock</li>
              <li>Scissors cuts Paper and decapitates Lizard</li>
              <li>Lizard eats Paper and poisons Spock</li>
              <li>Spock vaporizes Rock and smashes Scissors</li>
            </ul>
          </li>
          <li>Score is updated and players can play additional rounds</li>
        </ol>
      </CardContent>
    </Card>
  );
}
