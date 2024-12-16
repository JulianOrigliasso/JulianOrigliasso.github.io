import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Plus } from "lucide-react";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            CryptoEstate
          </Link>
          <div className="flex items-center space-x-6">
            <Button variant="ghost" asChild>
              <Link to="/properties">Properties</Link>
            </Button>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Button variant="outline" asChild>
                  <Link to="/properties/new">
                    <Plus className="h-4 w-4 mr-2" />
                    List Property
                  </Link>
                </Button>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
