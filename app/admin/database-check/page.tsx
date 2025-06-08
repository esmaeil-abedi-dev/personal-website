"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, RefreshCw, Database } from "lucide-react";

export default function DatabaseCheckPage() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    try {
      setStatus("loading");
      setError(null);

      const response = await fetch("/api/db-test");
      const data = await response.json();

      if (data.status === "success") {
        setStatus("success");
        setResult(data);
      } else {
        setStatus("error");
        setError(data.error || "Unknown error occurred");
        setResult(data);
      }
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Failed to check database connection"
      );
      console.error("Error checking database connection:", err);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">
        Database Connection Check
      </h1>
      <Suspense fallback={<div>Loading database check interface...</div>}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Connection Status
            </CardTitle>
            <CardDescription>
              Verify that your application can connect to the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === "loading" && (
              <div className="flex items-center justify-center p-6">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2">Testing database connection...</span>
              </div>
            )}

            {status === "success" && (
              <Alert className="border-green-500 bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <AlertTitle className="text-green-500">
                  Connection Successful
                </AlertTitle>
                <AlertDescription>
                  <p>Successfully connected to the database.</p>
                  {result?.data && (
                    <div className="mt-2">
                      <p>User count: {result.data.userCount}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Timestamp:{" "}
                        {new Date(result.data.timestamp).toLocaleString()}
                      </p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert variant="destructive">
                <XCircle className="h-5 w-5" />
                <AlertTitle>Connection Failed</AlertTitle>
                <AlertDescription>
                  <p>Failed to connect to the database.</p>
                  {error && (
                    <div className="mt-2 p-2 bg-destructive/20 rounded text-sm font-mono overflow-auto">
                      {error}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={checkConnection}
              disabled={status === "loading"}
              className="w-full"
            >
              {status === "loading" ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Test Connection Again
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>
              Check that your database environment variables are properly
              configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Required Environment Variables:</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>DATABASE_URL - The main connection string for Prisma</li>
                  <li>
                    DIRECT_URL - Direct connection URL (for Prisma migrations)
                  </li>
                </ul>
              </div>

              <Alert>
                <AlertTitle>Environment Variable Status</AlertTitle>
                <AlertDescription>
                  <p className="text-sm">
                    For security reasons, we can't display your actual
                    environment variables. Please check your Vercel project
                    settings to ensure they are correctly set.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
}
