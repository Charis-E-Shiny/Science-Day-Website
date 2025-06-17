import { useEffect, useState } from "react";
import { subscribeToPosters } from "@/lib/firebase";
import type { Poster } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useVotes() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeToPosters(
      (newPosters) => {
        setPosters(newPosters);
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load posters. Please try refreshing the page.",
          variant: "destructive",
        });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [toast]);

  return { posters, loading, error };
}