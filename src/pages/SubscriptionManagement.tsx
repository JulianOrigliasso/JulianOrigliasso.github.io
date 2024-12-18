import { useAuth0 } from '@auth0/auth0-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Package, History, Check } from 'lucide-react';

export default function SubscriptionManagement() {
  const plans = [
    {
      name: 'Basic',
      price: '0.01 BTC',
      description: 'Perfect for small agencies',
      features: [
        'Up to 5 active listings',
        'Basic analytics',
        'Standard support'
      ]
    },
    {
      name: 'Professional',
      price: '0.05 BTC',
      description: 'For growing agencies',
      features: [
        'Up to 25 active listings',
        'Advanced analytics',
        'Priority support',
        'Featured listings'
      ]
    },
    {
      name: 'Enterprise',
      price: '0.15 BTC',
      description: 'For large agencies',
      features: [
        'Unlimited active listings',
        'Premium analytics',
        '24/7 dedicated support',
        'Custom features',
        'API access'
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>

      {/* Current Plan Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Package className="h-6 w-6" />
          Current Plan
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Professional Plan</CardTitle>
            <CardDescription>Your next billing date is July 1, 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.05 BTC/month</div>
            <div className="mt-4">
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-5 w-5" />
                25 active listings available
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Change Plan</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Payment Method Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="h-6 w-6" />
          Payment Method
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Connected Wallet</CardTitle>
            <CardDescription>Your current payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-mono">0x1234...5678</div>
              <div className="text-sm text-gray-500 mt-1">Connected since June 1, 2024</div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Update Wallet</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Billing History Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <History className="h-6 w-6" />
          Billing History
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <div className="font-medium">June 2024 Subscription</div>
                  <div className="text-sm text-gray-500">Paid on June 1, 2024</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">0.05 BTC</div>
                  <div className="text-sm text-green-600">Completed</div>
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <div className="font-medium">May 2024 Subscription</div>
                  <div className="text-sm text-gray-500">Paid on May 1, 2024</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">0.05 BTC</div>
                  <div className="text-sm text-green-600">Completed</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Download History</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Available Plans Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.name}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-4">{plan.price}/month</div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  {plan.name === 'Professional' ? 'Current Plan' : 'Switch Plan'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
