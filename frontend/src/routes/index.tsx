import { queryOptions, useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Code2,
  RefreshCw,
  Server,
  XCircle,
} from 'lucide-react';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card';
import { useEffect } from 'react';

interface BackendResponse {
  message: string;
  path: string;
}

const BACKEND_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/+$/, '');
const ENDPOINT_URL = `${BACKEND_URL}/basic/rest`;

export const backendCheckQueryOptions = queryOptions({
  queryKey: ['backend-health'],
  queryFn: async (): Promise<BackendResponse> => {
    const res = await fetch(ENDPOINT_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = (await res.json()) as BackendResponse;
    console.log('[BasicRestController Test] Response from backend:', data);
    return data;
  },
  retry: 1,
});

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  const { data, error, isError, isFetching, isLoading, refetch } =
    useQuery(backendCheckQueryOptions);

  useEffect(() => {
    if (data) {
      console.log('[Frontend -> Backend Communication Test] Success:', data);
    } else if (error) {
      console.warn('[Frontend -> Backend Communication Test] Error:', error);
    }
  }, [data, error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="space-y-2 text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Activity className="size-3.5 text-primary animate-pulse" />
            Backend &lt;-&gt; Frontend Communication Diagnostics (TanStack Query)
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Connection Status</h1>
          <p className="text-sm text-muted-foreground">
            Testing{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
              BasicRestController
            </code>{' '}
            (
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
              GET /basic/rest
            </code>
            ) endpoint using <strong className="text-foreground">TanStack Query</strong>.
          </p>
        </div>

        <Card className="border-border/80 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-lg border p-2.5 transition-colors ${
                    isFetching
                      ? 'border-primary/20 bg-primary/10 text-primary animate-pulse'
                      : data
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : isError
                          ? 'border-destructive/20 bg-destructive/10 text-destructive'
                          : 'border-muted bg-muted text-muted-foreground'
                  }`}
                >
                  <Server className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Symfony Backend (API)</CardTitle>
                  <CardDescription className="mt-0.5 font-mono text-xs">
                    {ENDPOINT_URL}
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant={
                  isFetching
                    ? 'secondary'
                    : data
                      ? 'default'
                      : isError
                        ? 'destructive'
                        : 'secondary'
                }
                className="gap-1.5 px-2.5 py-1"
              >
                {isFetching ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin" />
                    Loading...
                  </>
                ) : isLoading ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin" />
                    Loading...
                  </>
                ) : data ? (
                  <>
                    <CheckCircle2 className="size-3.5" />
                    Connected successfully
                  </>
                ) : (
                  <>
                    <XCircle className="size-3.5" />
                    Connection error
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
                <RefreshCw className="mr-2 size-4 animate-spin text-primary" />
                Loading...
              </div>
            ) : data ? (
              <div className="space-y-3">
                <div className="space-y-2 rounded-lg border bg-muted/40 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Code2 className="size-3.5" />
                    JSON response from BasicRestController:
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-zinc-950 p-3 font-mono text-xs text-zinc-100">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-md border bg-card p-3">
                    <span className="mb-1 block text-muted-foreground">Backend message:</span>
                    <span className="font-semibold text-foreground">{data.message}</span>
                  </div>
                  <div className="rounded-md border bg-card p-3">
                    <span className="mb-1 block text-muted-foreground">Controller path:</span>
                    <span className="break-all font-mono text-foreground">{data.path}</span>
                  </div>
                </div>
              </div>
            ) : isError ? (
              <div className="space-y-1.5 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive">
                <p className="font-semibold">Failed to connect to the backend:</p>
                <p className="font-mono">
                  {error instanceof Error ? error.message : String(error)}
                </p>
                <p className="mt-2 text-muted-foreground">
                  Make sure the backend container is running (
                  <code className="font-mono">make up</code> or{' '}
                  <code className="font-mono">docker compose ps</code>) and the Nginx web server is
                  listening on port 8000.
                </p>
              </div>
            ) : null}

            <div className="flex items-center justify-between border-t pt-2 text-[11px] text-muted-foreground">
              <span>Managed by TanStack Query</span>
              <span>Also check DevTools Console (F12)</span>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col justify-between gap-2 sm:flex-row">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="w-full sm:w-auto"
            >
              <RefreshCw className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Loading...' : 'Retry request (refetch)'}
            </Button>

            <Button asChild size="sm" className="w-full sm:w-auto">
              <Link to="/project/backlog">
                Go to application (Backlog)
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
