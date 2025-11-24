"use client";

import { useState } from "react";

/**
 * Webhook Testing UI
 *
 * A simple interface to test webhook handling without needing external tools.
 */
export default function TestWebhooksPage() {
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testSubscriptionActive = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/test-webhook", {
        method: "GET",
      });
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to test webhook");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const testCheckoutCompleted = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/test-webhook", {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to test webhook");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Webhook Testing
          </h1>
          <p className="text-slate-600 mb-8">
            Test your Creem webhook implementation without external tools
          </p>

          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                ℹ️ Setup Required
              </h3>
              <p className="text-sm text-blue-800">
                Make sure you have{" "}
                <code className="bg-blue-100 px-2 py-1 rounded">
                  CREEM_WEBHOOK_SECRET
                </code>{" "}
                configured in your <code>.env</code> file.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={testSubscriptionActive}
                disabled={loading}
                className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "🎉 Test Subscription Active"}
              </button>

              <button
                onClick={testCheckoutCompleted}
                disabled={loading}
                className="bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "✅ Test Checkout Completed"}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-900 mb-2">❌ Error</h3>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-green-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">✓</span>
                Webhook Test Result
              </h3>

              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    Status
                  </div>
                  <div className="font-semibold text-slate-900">
                    {result.success ? (
                      <span className="text-green-600">✓ Success</span>
                    ) : (
                      <span className="text-red-600">✗ Failed</span>
                    )}
                  </div>
                </div>

                {result.event && (
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                      Event Details
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-slate-600">Type:</span>{" "}
                        <code className="bg-slate-100 px-2 py-1 rounded text-xs">
                          {result.event.type}
                        </code>
                      </div>
                      <div>
                        <span className="text-slate-600">Customer:</span>{" "}
                        <span className="font-medium">
                          {result.event.customer}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600">Product:</span>{" "}
                        <span className="font-medium">
                          {result.event.product}
                        </span>
                      </div>
                      {result.event.amount && (
                        <div>
                          <span className="text-slate-600">Amount:</span>{" "}
                          <span className="font-medium">
                            ${(result.event.amount / 100).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="text-xs text-blue-700 uppercase tracking-wider mb-2">
                    💡 Note
                  </div>
                  <p className="text-sm text-blue-800">
                    {result.note ||
                      "Check your server console for detailed webhook handler output"}
                  </p>
                </div>

                <details className="bg-white rounded-lg p-4">
                  <summary className="cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900">
                    View Raw Response
                  </summary>
                  <pre className="mt-3 text-xs bg-slate-100 p-3 rounded overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}

          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="font-semibold text-slate-900 mb-3">
              📖 What&apos;s Being Tested?
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>
                  <strong>Subscription Active:</strong> Tests the{" "}
                  <code className="bg-slate-200 px-1 rounded text-xs">
                    onGrantAccess
                  </code>{" "}
                  and{" "}
                  <code className="bg-slate-200 px-1 rounded text-xs">
                    onSubscriptionActive
                  </code>{" "}
                  handlers
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">✓</span>
                <span>
                  <strong>Checkout Completed:</strong> Tests the{" "}
                  <code className="bg-slate-200 px-1 rounded text-xs">
                    onCheckoutCompleted
                  </code>{" "}
                  handler with a one-time purchase
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>
                  <strong>Signature Verification:</strong> Ensures HMAC SHA256
                  signature validation is working correctly
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">✓</span>
                <span>
                  <strong>Data Normalization:</strong> Verifies snake_case to
                  camelCase conversion
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-6 text-center text-sm text-slate-500">
            Check your terminal/console for detailed webhook handler logs
          </div>
        </div>
      </div>
    </div>
  );
}
