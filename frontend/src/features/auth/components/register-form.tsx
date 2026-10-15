import * as React from 'react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { AlertCircle, Loader2 } from 'lucide-react';

import { Button } from '#/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '#/components/ui/field.tsx';
import { Input } from '#/components/ui/input.tsx';
import { useAuth } from '../queries';

export function RegisterForm({ className, ...props }: React.ComponentProps<typeof Card>) {
  const navigate = useNavigate();
  const search = useSearch({
    strict: false,
    select: (s: Record<string, unknown>) => ({
      redirect: typeof s.redirect === 'string' ? s.redirect : undefined,
    }),
  });
  const { register, login, isRegistering, isLoggingIn } = useAuth();

  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const isPending = isRegistering || isLoggingIn;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      await register({
        email,
        password,
        fullName: fullName.trim() || undefined,
      });

      // Automatically log the user in after registration
      await login({ email, password });

      const targetPath =
        search.redirect && search.redirect.startsWith('/') ? search.redirect : '/project';
      await navigate({ to: targetPath });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to create account. Please try again.');
      }
    }
  };

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your Triago account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isPending}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                required
              />
              <FieldDescription>
                We&apos;ll use this to identify your account and send notifications.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                required
              />
              <FieldDescription>Must be at least 8 characters long.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isPending}
                required
              />
              <FieldDescription>Please repeat your password to confirm.</FieldDescription>
            </Field>

            <Field>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
              <FieldDescription className="px-6 text-center">
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  search={search.redirect ? { redirect: search.redirect } : undefined}
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  Sign in
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
