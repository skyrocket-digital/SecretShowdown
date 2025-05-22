import { Card, CardContent } from "@/components/ui/card";

interface ScoreBoardProps {
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  currentRound: number;
}

export default function ScoreBoard({
  player1Name,
  player2Name,
  player1Score,
  player2Score,
  currentRound
}: ScoreBoardProps) {
  return (
    <Card className="p-4 text-center mb-4 w-full md:w-auto">
      <CardContent className="p-0">
        <h2 className="text-xl font-semibold text-primary mb-2">Score</h2>
        <div className="flex justify-center items-center gap-4 text-xl">
          <div>
            <span className="font-medium">{player1Name}</span>
            <span className="text-2xl font-bold ml-2">{player1Score}</span>
          </div>
          <div className="text-muted-foreground font-bold">vs</div>
          <div>
            <span className="font-medium">{player2Name}</span>
            <span className="text-2xl font-bold ml-2">{player2Score}</span>
          </div>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Round: <span>{currentRound}</span>
        </div>
      </CardContent>
    </Card>
  );
}
