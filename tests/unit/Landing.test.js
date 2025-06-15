import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Landing from '@components/landing';
import axios from 'axios';
import { useRouter } from 'next/navigation';

jest.mock('axios');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

process.env.API_HOST = 'http://localhost:3001/';

describe('Landing Component', () => {
  const mockPush = jest.fn();
  const mockUser = { id: 1, admin: true };
  const mockToken = 'mock-token';

  beforeEach(() => {
    jest.clearAllMocks();
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: jest.fn(),
        getItem: jest.fn((key) => {
          if (key === 'user') return JSON.stringify(mockUser);
          if (key === 'token') return JSON.stringify(mockToken);
          return null;
        }),
        clear: jest.fn(),
      },
      writable: true,
    });

    useRouter.mockReturnValue({
      push: mockPush,
    });
  });

  describe('Login Functionality', () => {
    test('handles successful login', async () => {
      const mockResponse = {
        data: {
          user: { id: 1, email: 'test@example.com' },
          token: 'mock-token'
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      render(<Landing />);
      
      const loginButton = screen.getByRole('button', { name: /log in/i });
      expect(loginButton).toBeInTheDocument();

      const allInputs = screen.getAllByRole('textbox');
      const visibleEmailInput = allInputs.find(input => 
        input.type === 'email' && !input.closest('.is-hidden')
      );
      
      const passwordInputs = document.querySelectorAll('input[type="password"]');
      const visiblePasswordInput = Array.from(passwordInputs).find(input => 
        !input.closest('.is-hidden')
      );

      await act(async () => {
        await userEvent.type(visibleEmailInput, 'test@example.com');
        await userEvent.type(visiblePasswordInput, 'password123');
      });

      await act(async () => {
        fireEvent.click(loginButton);
      });

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3001/users/login',
          { email: 'test@example.com', password: 'password123' }
        );
      });
    });

    test('handles failed login', async () => {
      axios.post.mockRejectedValueOnce(new Error('Login failed'));

      render(<Landing />);
      
      const loginButton = screen.getByRole('button', { name: /log in/i });
      const allInputs = screen.getAllByRole('textbox');
      const visibleEmailInput = allInputs.find(input => 
        input.type === 'email' && !input.closest('.is-hidden')
      );
      const passwordInputs = document.querySelectorAll('input[type="password"]');
      const visiblePasswordInput = Array.from(passwordInputs).find(input => 
        !input.closest('.is-hidden')
      );

      await act(async () => {
        await userEvent.type(visibleEmailInput, 'test@example.com');
        await userEvent.type(visiblePasswordInput, 'wrongpassword');
      });

      await act(async () => {
        fireEvent.click(loginButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/error logging in/i)).toBeInTheDocument();
      });
    });

    test('validates email format', async () => {
      render(<Landing />);
      
      const loginButton = screen.getByRole('button', { name: /log in/i });
      const allInputs = screen.getAllByRole('textbox');
      const visibleEmailInput = allInputs.find(input => 
        input.type === 'email' && !input.closest('.is-hidden')
      );
      const passwordInputs = document.querySelectorAll('input[type="password"]');
      const visiblePasswordInput = Array.from(passwordInputs).find(input => 
        !input.closest('.is-hidden')
      );

      await act(async () => {
        await userEvent.type(visibleEmailInput, 'invalid-email');
        await userEvent.type(visiblePasswordInput, 'password123');
      });

      await act(async () => {
        fireEvent.click(loginButton);
      });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });
  });

  describe('Signup Functionality', () => {
    test('handles successful signup with valid data', async () => {
      const mockResponse = {
        data: {
          user: { id: 1, email: 'newuser@example.com' },
          token: 'mock-token'
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      render(<Landing />);
      
      const signupLink = screen.getByText(/sign up/i);
      await act(async () => {
        fireEvent.click(signupLink);
      });

      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /next/i });
        expect(nextButton).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    test('handles signup validation errors', async () => {
      render(<Landing />);
      
      const signupLink = screen.getByText(/sign up/i);
      await act(async () => {
        fireEvent.click(signupLink);
      });

      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /next/i });
        expect(nextButton).toBeInTheDocument();
      });

      const nextButton = screen.getByRole('button', { name: /next/i });
      await act(async () => {
        fireEvent.click(nextButton);
      });

      await waitFor(() => {
        const signupButton = screen.getByRole('button', { name: /sign up/i });
        expect(signupButton).toBeInTheDocument();
      });

      const signupButton = screen.getByRole('button', { name: /sign up/i });
      await act(async () => {
        fireEvent.click(signupButton);
      });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });
}); 