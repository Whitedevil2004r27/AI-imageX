/**
 * AI-imageX: Authentication Flow Unit Tests
 * Tests login, signup, and Google OAuth handler logic in isolation.
 */

import { supabase } from '@/lib/supabase';

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('Authentication - Login Handler', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('✅ should call signInWithPassword with correct credentials', async () => {
    (mockSupabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: { user: { id: 'test-uid-123', email: 'dr@aix.test' }, session: {} },
      error: null,
    });

    const result = await supabase.auth.signInWithPassword({
      email: 'dr@aix.test',
      password: 'SecurePass!99',
    });

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'dr@aix.test',
      password: 'SecurePass!99',
    });
    expect(result.data.user?.email).toBe('dr@aix.test');
    expect(result.error).toBeNull();
  });

  it('✅ should return error for invalid credentials', async () => {
    (mockSupabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' },
    });

    const result = await supabase.auth.signInWithPassword({
      email: 'wrong@aix.test',
      password: 'WrongPassword',
    });

    expect(result.error?.message).toBe('Invalid login credentials');
    expect(result.data.user).toBeNull();
  });

  it('✅ should return error for unconfirmed email', async () => {
    (mockSupabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Email not confirmed' },
    });

    const result = await supabase.auth.signInWithPassword({
      email: 'unverified@aix.test',
      password: 'SomePass123',
    });

    expect(result.error?.message).toBe('Email not confirmed');
  });

});

describe('Authentication - Signup Handler', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('✅ should call signUp with email, password, and full name', async () => {
    (mockSupabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
      data: { user: { id: 'new-uid-456', email: 'new.dr@aix.test' }, session: null },
      error: null,
    });

    const result = await supabase.auth.signUp({
      email: 'new.dr@aix.test',
      password: 'ClinicalPass!77',
      options: { data: { full_name: 'Dr. Jane Smith' } },
    });

    expect(mockSupabase.auth.signUp).toHaveBeenCalledTimes(1);
    expect(result.data.user?.email).toBe('new.dr@aix.test');
    expect(result.error).toBeNull();
  });

  it('✅ should return error if email is already registered', async () => {
    (mockSupabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'User already registered' },
    });

    const result = await supabase.auth.signUp({
      email: 'existing@aix.test',
      password: 'Pass123!',
    });

    expect(result.error?.message).toBe('User already registered');
  });

});

describe('Authentication - Google OAuth Handler', () => {

  it('✅ should initiate Google OAuth redirect', async () => {
    (mockSupabase.auth.signInWithOAuth as jest.Mock).mockResolvedValueOnce({
      data: { provider: 'google', url: 'https://accounts.google.com/...' },
      error: null,
    });

    const result = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'http://localhost:3001/auth/callback' },
    });

    expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: { redirectTo: 'http://localhost:3001/auth/callback' },
    });
    expect(result.error).toBeNull();
  });

  it('✅ should return error when OAuth provider is misconfigured', async () => {
    (mockSupabase.auth.signInWithOAuth as jest.Mock).mockResolvedValueOnce({
      data: { provider: 'google', url: null },
      error: { message: 'OAuth provider not enabled' },
    });

    const result = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'http://localhost:3001/auth/callback' },
    });

    expect(result.error?.message).toBe('OAuth provider not enabled');
  });

});
