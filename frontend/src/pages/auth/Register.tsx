import React, { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react';
import { AuthShell } from '../../components/auth/AuthShell';
import { Button } from '../../components/ui/Button';
import { Field, Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';

interface FieldIconProps {
  icon: React.ReactNode;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  trailing?: React.ReactNode;
  invalid?: boolean;
}

function IconInput({ icon, inputProps, trailing, invalid }: FieldIconProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle" aria-hidden>
        {icon}
      </span>
      <Input {...inputProps} invalid={invalid} className={cn('pl-10', trailing && 'pr-10')} />
      {trailing && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</span>
      )}
    </div>
  );
}

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password_confirm) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      await register(form);
      navigate('/login');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { email?: string[]; password?: string[]; detail?: string; [key: string]: unknown } } };
        const data = axiosErr.response?.data;
        if (data?.email) setError(data.email[0]);
        else if (data?.password) setError(data.password[0]);
        else if (data?.detail) setError(data.detail as string);
        else setError('Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create an account"
      subtitle="Start your journey with RecruitFlow."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert tone="danger" title={error} />}

        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" htmlFor="register-first-name" required>
            <IconInput
              icon={<UserIcon className="h-5 w-5" />}
              inputProps={{
                id: 'register-first-name',
                name: 'first_name',
                type: 'text',
                autoComplete: 'given-name',
                required: true,
                value: form.first_name,
                onChange: set('first_name'),
                placeholder: 'John',
              }}
            />
          </Field>

          <Field label="Last name" htmlFor="register-last-name" required>
            <IconInput
              icon={<UserIcon className="h-5 w-5" />}
              inputProps={{
                id: 'register-last-name',
                name: 'last_name',
                type: 'text',
                autoComplete: 'family-name',
                required: true,
                value: form.last_name,
                onChange: set('last_name'),
                placeholder: 'Doe',
              }}
            />
          </Field>
        </div>

        <Field label="Email address" htmlFor="register-email" required>
          <IconInput
            icon={<MailIcon className="h-5 w-5" />}
            inputProps={{
              id: 'register-email',
              name: 'email',
              type: 'email',
              autoComplete: 'email',
              required: true,
              value: form.email,
              onChange: set('email'),
              placeholder: 'you@company.com',
            }}
            invalid={!!error && !form.email}
          />
        </Field>

        <Field label="Password" htmlFor="register-password" required>
          <IconInput
            icon={<LockIcon className="h-5 w-5" />}
            inputProps={{
              id: 'register-password',
              name: 'password',
              type: showPassword ? 'text' : 'password',
              autoComplete: 'new-password',
              required: true,
              value: form.password,
              onChange: set('password'),
              placeholder: '••••••••',
            }}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="flex h-8 w-8 items-center justify-center rounded-md text-ink-subtle transition-colors duration-150 ease-out hover:bg-subtle hover:text-ink"
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            }
          />
        </Field>

        <Field label="Confirm password" htmlFor="register-password-confirm" required>
          <IconInput
            icon={<LockIcon className="h-5 w-5" />}
            inputProps={{
              id: 'register-password-confirm',
              name: 'password_confirm',
              type: showPassword ? 'text' : 'password',
              autoComplete: 'new-password',
              required: true,
              value: form.password_confirm,
              onChange: set('password_confirm'),
              placeholder: '••••••••',
            }}
            invalid={!!error && form.password !== form.password_confirm}
          />
        </Field>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isLoading}
          className="w-full"
        >
          {isLoading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Already have an account?{' '}
        <Link to="/login" className={cn('font-medium text-brand transition-colors duration-150 ease-out hover:text-brand-hover')}>
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}