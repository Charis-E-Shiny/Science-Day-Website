import { PosterCard } from "@/components/poster-card";
import type { Poster } from "@shared/schema";

interface PosterGridProps {
  posters: Poster[];
}

export function PosterGrid({ posters }: PosterGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {posters.map((poster) => (
        <PosterCard key={poster.id} poster={poster} />
      ))}
    </div>
  );
}
