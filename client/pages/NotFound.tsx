import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="text-center max-w-md space-y-6 relative z-10">
        <div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">404</h1>
          <h2 className="text-2xl font-bold text-white mb-2">
            Page Not Found
          </h2>
          <p className="text-white/60">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild className="bg-gradient-to-r from-primary to-accent hover:from-primary-700 hover:to-accent text-white font-semibold">
            <Link to="/">Return Home</Link>
          </Button>
          <Button asChild className="bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
