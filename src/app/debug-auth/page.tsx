"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DebugAuthPage() {
  const { data: session, status } = useSession();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAPI = async () => {
    setTestResults([]);
    addLog("Starting API test...");

    const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
    addLog(`API_URL: ${API_URL || "NOT SET"}`);

    if (!session?.token) {
      addLog("❌ No token in session!");
      return;
    }

    addLog(`✅ Token exists (length: ${session.token.length})`);
    addLog(`Token preview: ${session.token.slice(0, 15)}...${session.token.slice(-15)}`);

    // Try to decode JWT
    try {
      const parts = session.token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        addLog(`Token payload: ${JSON.stringify(payload, null, 2)}`);
        if (payload.exp) {
          const expDate = new Date(payload.exp * 1000);
          const isExpired = Date.now() > payload.exp * 1000;
          addLog(`Token expires: ${expDate.toISOString()}`);
          addLog(`Token expired: ${isExpired ? "❌ YES" : "✅ NO"}`);
        }
      }
    } catch (e) {
      addLog("⚠️ Could not decode token (might not be JWT)");
    }

    // Test 1: Bearer format
    addLog("\n--- Test 1: Authorization: Bearer <token> ---");
    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          "Authorization": `Bearer ${session.token}`,
          "Content-Type": "application/json"
        },
        cache: "no-store"
      });

      addLog(`Status: ${response.status} ${response.statusText}`);
      addLog(`Content-Type: ${response.headers.get("content-type")}`);
      
      const text = await response.text();
      addLog(`Response length: ${text.length} chars`);
      addLog(`Response: ${text.substring(0, 500)}`);

      if (response.ok) {
        addLog("✅ Test 1 PASSED!");
      } else {
        addLog("❌ Test 1 FAILED");
      }
    } catch (error) {
      addLog(`❌ Test 1 ERROR: ${error}`);
    }

    // Test 2: No Bearer prefix
    addLog("\n--- Test 2: Authorization: <token> (no Bearer) ---");
    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          "Authorization": session.token,
          "Content-Type": "application/json"
        },
        cache: "no-store"
      });

      addLog(`Status: ${response.status} ${response.statusText}`);
      const text = await response.text();
      addLog(`Response: ${text.substring(0, 200)}`);

      if (response.ok) {
        addLog("✅ Test 2 PASSED!");
      } else {
        addLog("❌ Test 2 FAILED");
      }
    } catch (error) {
      addLog(`❌ Test 2 ERROR: ${error}`);
    }

    // Test 3: Custom header
    addLog("\n--- Test 3: x-auth-token: <token> ---");
    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          "x-auth-token": session.token,
          "Content-Type": "application/json"
        },
        cache: "no-store"
      });

      addLog(`Status: ${response.status} ${response.statusText}`);
      const text = await response.text();
      addLog(`Response: ${text.substring(0, 200)}`);

      if (response.ok) {
        addLog("✅ Test 3 PASSED!");
      } else {
        addLog("❌ Test 3 FAILED");
      }
    } catch (error) {
      addLog(`❌ Test 3 ERROR: ${error}`);
    }

    // Test 4: token header
    addLog("\n--- Test 4: token: <token> ---");
    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          "token": session.token,
          "Content-Type": "application/json"
        },
        cache: "no-store"
      });

      addLog(`Status: ${response.status} ${response.statusText}`);
      const text = await response.text();
      addLog(`Response: ${text.substring(0, 200)}`);

      if (response.ok) {
        addLog("✅ Test 4 PASSED!");
      } else {
        addLog("❌ Test 4 FAILED");
      }
    } catch (error) {
      addLog(`❌ Test 4 ERROR: ${error}`);
    }

    addLog("\n=== TESTS COMPLETE ===");
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug Tool</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Session Status</h2>
        <div className="space-y-2 font-mono text-sm">
          <div>Status: <span className="font-bold">{status}</span></div>
          <div>Has Session: {session ? "✅ Yes" : "❌ No"}</div>
          <div>Has Token: {session?.token ? "✅ Yes" : "❌ No"}</div>
          <div>Has User: {session?.user ? "✅ Yes" : "❌ No"}</div>
          {session?.user && (
            <div>User Email: {session.user.email}</div>
          )}
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Environment</h2>
        <div className="space-y-2 font-mono text-sm">
          <div>NEXT_PUBLIC_BASE_URL: {process.env.NEXT_PUBLIC_BASE_URL || "❌ NOT SET"}</div>
          <div>NODE_ENV: {process.env.NODE_ENV}</div>
        </div>
      </Card>

      <Button 
        onClick={testAPI} 
        disabled={status !== "authenticated"}
        className="mb-6"
        size="lg"
      >
        {status !== "authenticated" ? "Please Log In First" : "Run API Tests"}
      </Button>

      {testResults.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-xs overflow-auto max-h-96 whitespace-pre-wrap">
            {testResults.join("\n")}
          </div>
        </Card>
      )}

      <Card className="p-6 mt-6 bg-yellow-50">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Make sure you're logged in</li>
          <li>Click "Run API Tests" button</li>
          <li>Check which test passes (status 200)</li>
          <li>Update your service files to use the working format</li>
          <li>If all tests fail, check the error messages for clues</li>
        </ol>
      </Card>
    </div>
  );
}
