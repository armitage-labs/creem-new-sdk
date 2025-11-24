"use client";

import { useState } from "react";

export default function TestConsole() {
  const [activeTab, setActiveTab] = useState("products");
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRequest = async (
    endpoint: string,
    method: string,
    body?: unknown
  ) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(
        `/api/test?endpoint=${endpoint}&method=${method}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-mono text-sm">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Creem SDK Test Console
          </h1>
          <p className="text-gray-600">
            Test your SDK implementation directly from the browser.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <nav className="col-span-3 flex flex-col space-y-1">
            {[
              "products",
              "checkouts",
              "customers",
              "subscriptions",
              "transactions",
              "licenses",
              "discounts",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-3 py-2 text-left font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          {/* Main Content Area */}
          <main className="col-span-9 space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 border-b pb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Actions
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {activeTab === "products" && (
                  <>
                    <ActionButton
                      // TODO: OK But with some type changes on product response.
                      label="List Products"
                      onClick={() =>
                        handleRequest("products", "list", { limit: 5 })
                      }
                    />
                    <ActionButton
                      // TODO: OK But with some type changes on product response.
                      label="Get Product"
                      onClick={() =>
                        handleRequest("products", "get", {
                          productId: "prod_7CIbZEZnRC5DWibmoOboOu",
                        })
                      }
                    />
                    <ActionButton
                      label="Create Product"
                      onClick={() =>
                        handleRequest("products", "create", {
                          name: "My awesome new product " + Date.now(),
                          price: 100,
                          currency: "USD",
                          description: "My awesome new product description",
                          billingType: "recurring",
                          billingPeriod: "every-month",
                        })
                      }
                    />
                  </>
                )}

                {activeTab === "checkouts" && (
                  <>
                    <ActionButton
                      label="Get Checkout"
                      onClick={() =>
                        handleRequest("checkouts", "get", {
                          checkoutId: "ch_jLCIRmyQraT9J9oR4SSJi",
                        })
                      }
                    />
                    <ActionButton
                      label="Create Checkout"
                      onClick={() =>
                        handleRequest("checkouts", "create", {
                          productId: "prod_7CIbZEZnRC5DWibmoOboOu",
                          units: 2,
                          customer: {
                            email: "test@test.com",
                          },
                          customField: [
                            {
                              type: "text",
                              key: "name",
                              label: "Name bro",
                              optional: false,
                            },
                          ],
                          metadata: {
                            userId: "123 metadata",
                          },
                          successUrl: "https://google.com/success",
                          requestId: "123",
                          discountCode: "SUMMER2024",
                        })
                      }
                    />
                  </>
                )}

                {activeTab === "customers" && (
                  <>
                    <ActionButton
                      label="List Customers"
                      onClick={() =>
                        handleRequest("customers", "list", { limit: 5 })
                      }
                    />
                    <ActionButton
                      label="Get Customer"
                      onClick={
                        () =>
                          handleRequest("customers", "get", {
                            email: "bla@gmail.com",
                          })
                        // {
                        //   "id": "cust_4savI0kWkYKFl5VUeeOCwQ",
                        //   "object": "customer",
                        //   "email": "bla@gmail.com",
                        //   "name": "Andre",
                        //   "country": "EE",
                        //   "createdAt": "2025-11-18T15:18:05.499Z",
                        //   "updatedAt": "2025-11-18T15:18:05.499Z",
                        //   "mode": "test"
                        // },
                      }
                    />
                    <ActionButton
                      label="Create Portal Link"
                      onClick={() =>
                        handleRequest("customers", "createPortal", {
                          customerId: "cust_4savI0kWkYKFl5VUeeOCwQ",
                        })
                      }
                    />
                  </>
                )}

                {activeTab === "subscriptions" && (
                  <>
                    <ActionButton
                      label="Get Subscription"
                      onClick={() =>
                        handleRequest("subscriptions", "get", {
                          subscriptionId: "sub_1J0iDahP5HG679BSVUwjOr",
                        })
                      }
                    />
                    <ActionButton
                      label="Cancel Subscription"
                      onClick={() =>
                        handleRequest("subscriptions", "cancel", {
                          subscriptionId: "sub_7HdvV2Xyy0uM3jweISLn0X",
                        })
                      }
                    />
                    <ActionButton
                      label="Update Subscription"
                      onClick={() =>
                        handleRequest("subscriptions", "update", {
                          subscriptionId: "sub_1J0iDahP5HG679BSVUwjOr",
                          updateBehavior: "proration-charge",
                          items: [
                            {
                              id: "sitem_4D6a5XVFo5sP3sPzc680X4", // TODO: This is required.
                              productId: "prod_5lcsDznEUqvbm1J1Z7an3h",
                              units: 3,
                            },
                          ],
                        })
                      }
                    />
                    <ActionButton
                      label="Upgrade Subscription"
                      onClick={() =>
                        handleRequest("subscriptions", "upgrade", {
                          subscriptionId: "sub_6BAYbaCYrhiterfBd11VGc",
                          productId: "prod_5lcsDznEUqvbm1J1Z7an3h",
                          updateBehavior: "proration-charge-immediately",
                        })
                      }
                    />
                  </>
                )}
                {activeTab === "transactions" && (
                  <>
                    <ActionButton
                      label="List Transactions"
                      onClick={() =>
                        handleRequest("transactions", "list", { limit: 5 })
                      }
                    />
                    <ActionButton
                      label="Get Transaction"
                      onClick={() =>
                        handleRequest("transactions", "get", {
                          transactionId: "tran_4U3oiodIoaYVzsszI8G8k3",
                        })
                      }
                    />
                  </>
                )}
                {activeTab === "licenses" && (
                  <>
                    <ActionButton
                      label="Activate License"
                      onClick={() =>
                        handleRequest("licenses", "activate", {
                          key: "lic_key_123",
                          instanceName: "test-server",
                        })
                      }
                    />
                    <ActionButton
                      label="Validate License"
                      onClick={() =>
                        handleRequest("licenses", "validate", {
                          key: "lic_key_123",
                          instanceId: "inst_123",
                        })
                      }
                    />
                    <ActionButton
                      label="Deactivate License"
                      onClick={() =>
                        handleRequest("licenses", "deactivate", {
                          key: "lic_key_123",
                          instanceId: "inst_123",
                        })
                      }
                    />
                  </>
                )}
                {activeTab === "discounts" && (
                  <>
                    <ActionButton
                      label="Get Discount"
                      onClick={() =>
                        handleRequest("discounts", "get", {
                          discountCode: "SUMMER2024",
                        })
                      }
                    />
                    <ActionButton
                      label="Create Discount"
                      onClick={() =>
                        handleRequest("discounts", "create", {
                          name: "Winter Sale",
                          type: "percentage",
                          duration: "forever",
                          appliesToProducts: [
                            "prod_5lcsDznEUqvbm1J1Z7an3h",
                            "prod_7CIbZEZnRC5DWibmoOboOu",
                          ],
                          code: "WINTER2025",
                          currency: "USD",
                          percentage: 20,
                          // amount: 20,
                          // expiryDate: new Date(
                          //   Date.now() + 1000 * 60 * 60 * 24 * 365
                          // ).toISOString(),
                          // maxRedemptions: 100,
                          // durationInMonths: 12,
                        })
                      }
                    />
                    <ActionButton
                      label="Delete Discount"
                      onClick={() =>
                        handleRequest("discounts", "delete", {
                          discountId: "dis_6IzAvUj6hBNUpkKw4TNJ04",
                        })
                      }
                    />
                  </>
                )}
              </div>
            </div>

            {/* Results Panel */}
            <div className="rounded-lg bg-gray-900 p-6 shadow-lg text-gray-100">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-400">
                Response
              </h3>
              {loading ? (
                <div className="animate-pulse text-gray-400">
                  Sending request...
                </div>
              ) : error ? (
                <div className="text-red-400 overflow-auto whitespace-pre-wrap">
                  {error}
                </div>
              ) : result ? (
                <pre className="overflow-auto max-h-96 text-xs text-green-300">
                  {JSON.stringify(result, null, 2)}
                </pre>
              ) : (
                <div className="text-gray-600 italic">
                  Select an action to see results
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-md bg-white border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {label}
    </button>
  );
}
