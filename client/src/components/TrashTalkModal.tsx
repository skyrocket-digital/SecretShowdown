import { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface TrashTalkModalProps {
  isOpen: boolean;
  onClose: () => void;
  loserName: string;
  winnerName: string;
}

// Array of trash talk messages with {loser} and {winner} placeholders
const trashTalkMessages = [
  "Wow {loser}, even my grandma plays better than that!",
  "Hey {loser}, maybe try using your eyes next time?",
  "{loser} is playing like they've never seen rock, paper, or scissors before!",
  "{winner} just schooled {loser} so bad they need to go back to kindergarten!",
  "Is {loser} even trying? My pet rock could make better choices!",
  "That was PAINFUL to watch, {loser}. Did you just close your eyes and pick?",
  "{loser} might want to consider a career change after that pathetic display!",
  "Someone call a doctor! {loser} just got absolutely destroyed by {winner}!",
  "Legend has it {loser} is still trying to figure out how the game works...",
  "That wasn't a game, that was a massacre! {winner} is taking no prisoners!",
  "{loser}'s strategy is so bad it makes random choice look brilliant!",
  "Did {loser} forget how to use their hands? That was embarrassing!",
  "{winner} is playing chess while {loser} is playing... I don't even know what!",
  "I've seen better decision-making from a magic 8-ball than from {loser}!",
  "{loser} might need some ice for that BURN!",
];

export default function TrashTalkModal({ isOpen, onClose, loserName, winnerName }: TrashTalkModalProps) {
  const [message, setMessage] = useState<string>("");
  
  // Generate a random trash talk message when the modal opens
  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * trashTalkMessages.length);
      const randomMessage = trashTalkMessages[randomIndex]
        .replace(/{loser}/g, loserName)
        .replace(/{winner}/g, winnerName);
      
      setMessage(randomMessage);
    }
  }, [isOpen, loserName, winnerName]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">Round Smack Talk!</DialogTitle>
        </DialogHeader>
        <div className="p-6 text-center">
          <div className="text-xl font-bold mb-4 text-destructive">
            <span className="material-icons text-3xl mb-2">local_fire_department</span>
            <p>{message}</p>
          </div>
          <p className="text-sm text-muted-foreground mt-4">Don't take it personally... or do, whatever makes you play better!</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}