import { type ReactNode } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { Properties } from './pages/Properties';
import { PropertyDetails } from './pages/PropertyDetails';
import { CreateProperty } from './pages/CreateProperty';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AuthProvider } from './contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/properties/new" element={
                <ProtectedRoute>
                  <CreateProperty />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
