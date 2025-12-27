import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import LoginNew from '../pages/LoginNew';

// Mock AuthContext
vi.mock('../utils/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
    currentUser: null
  })
}));

describe('Login Page', () => {
  it('renders login form', () => {
    render(
      <BrowserRouter>
        <LoginNew />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/password/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();
  });
});
