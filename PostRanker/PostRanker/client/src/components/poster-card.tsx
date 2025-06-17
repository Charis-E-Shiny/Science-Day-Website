import { Card, CardContent } from "@/components/ui/card";
import { ChevronUp, ChevronDown, FileWarning, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { vote } from "@/lib/firebase";
import type { Poster } from "@shared/schema";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PosterCardProps {
  poster: Poster;
}

export function PosterCard({ poster }: PosterCardProps) {
  const [loadError, setLoadError] = useState(false);
  const [userVoted, setUserVoted] = useState(() => false); // Initialize userVoted to false
  const { toast } = useToast();

  const handleVote = async (type: "up" | "down") => {
    try {
      if (userVoted) {
        toast({
          title: "Already Voted",
          description: "You have already voted on this poster",
          variant: "destructive",
        });
        return;
      }

      await vote(poster.id, type);
      setUserVoted(true);
      toast({
        title: "Success",
        description: `Successfully voted ${type === "up" ? "up" : "down"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to vote",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            {loadError ? (
              <div className="w-full aspect-[4/3] rounded-md bg-muted flex items-center justify-center flex-col gap-2">
                <FileWarning className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Failed to load PDF</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(poster.imageUrl, '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in New Tab
                </Button>
              </div>
            ) : (
              <iframe
                src={poster.imageUrl}
                className="w-full aspect-[4/3] rounded-md"
                onError={() => setLoadError(true)}
                frameBorder="0"
              />
            )}
          </div>

          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{poster.teamName}</h3>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-1 ${
                  userVoted ? 'opacity-50 cursor-not-allowed' : 'text-green-600 hover:text-green-700'
                }`}
                onClick={() => handleVote("up")}
                disabled={userVoted}
              >
                <ChevronUp className="h-4 w-4" />
                <span>{poster.upvotes}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-1 ${
                  userVoted ? 'opacity-50 cursor-not-allowed' : 'text-red-600 hover:text-red-700'
                }`}
                onClick={() => handleVote("down")}
                disabled={userVoted}
              >
                <ChevronDown className="h-4 w-4" />
                <span>{poster.downvotes}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}