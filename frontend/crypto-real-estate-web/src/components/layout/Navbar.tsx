import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Plus } from "lucide-react";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          CryptoEstate
        </Link>
        <div className="space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/properties">Properties</Link>
          </Button>
          {isAuthenticated ? (
            <>
              <Button variant="outline" asChild>
                <Link to="/properties/new">
                  <Plus className="h-4 w-4 mr-2" />
                  List Property
                </Link>
              </Button>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="outline" asChild className="ml-2">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
