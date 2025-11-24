"use client";

import { useState } from "react";
import { creem } from "@/app/lib/creem";

export default function BuyPage() {
  const [productId, setProductId] = useState("");
  const [units, setUnits] = useState(1);
  const [email, setEmail] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCheckoutUrl(null);

    try {
      const checkout = await fetch("/api/creem", {
        method: "POST",
        body: JSON.stringify({
          productId,
          units,
          customer: email ? { email } : undefined,
          discountCode: discountCode || undefined,
          successUrl: `${window.location.origin}/success`,
          requestId: `req_${Date.now()}`,
        }),
      });

      const data = await checkout.json();
      console.log("data", data);

      setCheckoutUrl(data.checkoutUrl);

      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create checkout"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Create Checkout
        </h1>

        <form onSubmit={handleCreateCheckout} className="space-y-4">
          <div>
            <label
              htmlFor="productId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product ID *
            </label>
            <input
              id="productId"
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="prod_abc123"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email (optional)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="customer@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="units"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Units
            </label>
            <input
              id="units"
              type="number"
              value={units}
              onChange={(e) => setUnits(parseInt(e.target.value) || 1)}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="discountCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Discount Code (optional)
            </label>
            <input
              id="discountCode"
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="SAVE10"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {checkoutUrl && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">
                Checkout created! Redirecting...
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !productId}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating..." : "Create Checkout"}
          </button>
        </form>
      </div>
    </div>
  );
}
