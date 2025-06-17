import { Link, useLocation } from "wouter";
import { BarChart3, Home } from "lucide-react";

export function NavBar() {
  const [location] = useLocation();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <button className={`flex items-center space-x-2 ${location === "/" ? "text-primary" : "text-muted-foreground hover:text-primary transition-colors"}`}>
                <Home className="h-5 w-5" />
                <span>Home</span>
              </button>
            </Link>
            <Link href="/analytics">
              <button className={`flex items-center space-x-2 ${location === "/analytics" ? "text-primary" : "text-muted-foreground hover:text-primary transition-colors"}`}>
                <BarChart3 className="h-5 w-5" />
                <span>Analytics</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}