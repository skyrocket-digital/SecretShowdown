import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type GameState, type Choice, type PlayerState } from "@shared/schema";

const initialPlayerState: PlayerState = {
  id: null,
  name: "",
  score: 0,
  choice: null
};

const initialGameState: GameState = {
  id: 0,
  player1: { ...initialPlayerState },
  player2: { ...initialPlayerState },
  currentRound: 1,
  status: "registration"
};

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [pollingEnabled, setPollingEnabled] = useState(false);

  // Create new game
  const createGameMutation = useMutation({
    mutationFn: async ({ player1Name, player2Name }: { player1Name: string; player2Name: string }) => {
      const res = await apiRequest("POST", "/api/games", { player1Name, player2Name });
      return res.json();
    },
    onSuccess: (data) => {
      setGameState({
        id: data.id,
        player1: {
          id: data.player1Id,
          name: player1Name,
          score: 0,
          choice: null
        },
        player2: {
          id: data.player2Id,
          name: player2Name,
          score: 0,
          choice: null
        },
        currentRound: data.currentRound,
        status: "player1-turn"
      });
    },
  });

  // Store player names for use in the onSuccess callback
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  
  const startGame = (player1: string, player2: string) => {
    setPlayer1Name(player1);
    setPlayer2Name(player2);
    createGameMutation.mutate({ player1Name: player1, player2Name: player2 });
  };

  // Submit player choice
  const submitChoiceMutation = useMutation({
    mutationFn: async ({ gameId, playerId, choice, roundNumber }: { gameId: number; playerId: number; choice: Choice; roundNumber: number }) => {
      const res = await apiRequest("POST", `/api/games/${gameId}/choices`, { playerId, choice, roundNumber });
      return res.json();
    },
    onSuccess: (data, variables) => {
      const { playerId, choice } = variables;
      
      setGameState(prev => {
        const newState = { ...prev };
        
        if (playerId === prev.player1.id) {
          newState.player1.choice = choice;
          newState.status = "player2-turn";
        } else if (playerId === prev.player2.id) {
          newState.player2.choice = choice;
          newState.status = "player1-turn";
        }
        
        // If both players have submitted, enable polling for results
        if (newState.player1.choice && newState.player2.choice) {
          newState.status = "result";
          setPollingEnabled(true);
        }
        
        return newState;
      });
    }
  });

  // Make choice
  const makeChoice = (playerId: number, choice: Choice) => {
    if (!gameState.id) return;
    
    submitChoiceMutation.mutate({
      gameId: gameState.id,
      playerId,
      choice,
      roundNumber: gameState.currentRound
    });
  };

  // Define the round result type
  interface RoundResultResponse {
    gameId: number;
    roundNumber: number;
    player1Choice: Choice;
    player2Choice: Choice;
    winner: 'player1' | 'player2' | 'draw';
    player1Score: number;
    player2Score: number;
  }

  // Get round result
  const { data: roundResult, refetch: refetchResult } = useQuery<RoundResultResponse>({
    queryKey: [`/api/games/${gameState.id}/rounds/${gameState.currentRound}/result`],
    enabled: pollingEnabled && gameState.status === "result",
    refetchInterval: pollingEnabled ? 1000 : false
  });

  // Update game state when round result changes
  useEffect(() => {
    if (roundResult) {
      setPollingEnabled(false);
      setGameState(prev => ({
        ...prev,
        player1: {
          ...prev.player1,
          score: roundResult.player1Score
        },
        player2: {
          ...prev.player2,
          score: roundResult.player2Score
        },
        status: "result"
      }));
    }
  }, [roundResult]);

  // Start next round
  const nextRoundMutation = useMutation({
    mutationFn: async (gameId: number) => {
      const res = await apiRequest("POST", `/api/games/${gameId}/nextRound`, {});
      return res.json();
    },
    onSuccess: (data) => {
      setGameState(prev => ({
        ...prev,
        currentRound: data.currentRound,
        player1: {
          ...prev.player1,
          choice: null
        },
        player2: {
          ...prev.player2,
          choice: null
        },
        status: "player1-turn"
      }));
    }
  });

  // Start a new round
  const startNextRound = () => {
    if (!gameState.id) return;
    nextRoundMutation.mutate(gameState.id);
  };

  // Reset game
  const resetGame = () => {
    setGameState(initialGameState);
    setPollingEnabled(false);
  };

  // Return values and methods
  return {
    gameState,
    startGame,
    makeChoice,
    startNextRound,
    resetGame,
    roundResult,
    isCreatingGame: createGameMutation.isPending,
    isSubmittingChoice: submitChoiceMutation.isPending,
    isStartingNextRound: nextRoundMutation.isPending
  };
}
