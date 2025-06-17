import { useVotes } from "@/hooks/use-votes";
import { PosterGrid } from "@/components/poster-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { posters, loading, error } = useVotes();

  if (loading) {
    return (
      <div className="container mx-auto">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Poster Voting
          </h1>
          <p className="text-muted-foreground mt-2">Loading posters...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="w-full h-[200px]" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[100px]" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Poster Voting
        </h1>
        <p className="text-muted-foreground mt-2">
          Vote for your favorite team posters!
        </p>
      </div>
      {posters && posters.length > 0 ? (
        <PosterGrid posters={posters} />
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No posters available at the moment.</p>
        </div>
      )}
    </div>
  );
}