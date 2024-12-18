import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import Home from './pages/Home'
import SubscriptionManagement from './pages/SubscriptionManagement'
import CreateListing from './pages/CreateListing'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">CoinEstate.com.au</Link>
            <div className="space-x-2">
              <Link to="/subscription">
                <Button variant="outline">View Subscription Management</Button>
              </Link>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subscription" element={<SubscriptionManagement />} />
          <Route path="/create-listing" element={<CreateListing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
