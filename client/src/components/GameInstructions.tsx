import { Card, CardContent } from "@/components/ui/card";

export default function GameInstructions() {
  return (
    <Card className="p-6 mb-8 max-w-lg mx-auto">
      <CardContent className="p-0">
        <h2 className="text-xl font-semibold text-primary mb-4">How to Play</h2>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
          <li>Enter both player names and click "Start Game"</li>
          <li>Each player secretly selects rock, paper, or scissors</li>
          <li>After both players have chosen, the selections are revealed</li>
          <li>Winner is determined by classic rules:
            <ul className="list-disc pl-5 mt-1 text-sm">
              <li>Rock crushes Scissors</li>
              <li>Scissors cuts Paper</li>
              <li>Paper covers Rock</li>
            </ul>
          </li>
          <li>Score is updated and players can play additional rounds</li>
        </ol>
      </CardContent>
    </Card>
  );
}
