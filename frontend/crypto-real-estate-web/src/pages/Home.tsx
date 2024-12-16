import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Find Your Next Home with Crypto</h1>
        <p className="text-xl text-muted-foreground">Browse properties available for purchase with cryptocurrency</p>
        <Button size="lg" asChild>
          <Link to="/properties">View Properties</Link>
        </Button>
      </section>
    </div>
  );
}
