import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextEditor from '@components/textEditor';
import axios from 'axios';
import { useRouter } from 'next/navigation';

jest.mock('axios');
jest.mock('react-quill', () => {
  return function MockReactQuill({ value, onChange }) {
    return (
      <div>
        <div data-testid="quill-content" dangerouslySetInnerHTML={{ __html: value }} />
        <textarea
          data-testid="quill-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          role="textbox"
        />
      </div>
    );
  };
});

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

process.env.API_HOST = 'http://localhost:3001/';

describe('TextEditor Component', () => {
  const mockPush = jest.fn();
  const mockUser = { id: 1, admin: true };
  const mockToken = 'mock-token';
  const mockContent = '<p>Initial content</p>';

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

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('Basic Functions', () => {
    test('renders initial content correctly', () => {
      render(<TextEditor id={1} content={mockContent} />);
      
      const contentDiv = screen.getByTestId('quill-content');
      expect(contentDiv).toHaveTextContent('Initial content');
    });

    test('updates content successfully', async () => {
      axios.put.mockResolvedValueOnce({ data: { success: true } });
      
      render(<TextEditor id={1} content={mockContent} type="lesson" />);
      
      const editor = screen.getByTestId('quill-editor');
      await userEvent.clear(editor);
      await userEvent.type(editor, 'Updated content');
      
      const updateButton = screen.getByRole('button', { name: /insert/i });
      await userEvent.click(updateButton);
      
      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith(
          'http://localhost:3001/lessons/updateLessonContent/1',
          { content: 'Updated content', token: mockToken }
        );
      });
    });

    test('handles content update error', async () => {
      axios.put.mockRejectedValueOnce(new Error('Update failed'));
      
      render(<TextEditor id={1} content={mockContent} type="lesson" />);
      
      const editor = screen.getByTestId('quill-editor');
      await userEvent.clear(editor);
      await userEvent.type(editor, 'Updated content');
      
      const updateButton = screen.getByRole('button', { name: /insert/i });
      await userEvent.click(updateButton);
      
      await waitFor(() => {
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

  describe('Editor Features', () => {
    test('maintains toolbar functionality', () => {
      render(<TextEditor id={1} content={mockContent} />);
      
      expect(screen.getByTestId('quill-editor')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /insert/i })).toBeInTheDocument();
    });

    test('handles empty content', () => {
      render(<TextEditor id={1} content="" />);
      
      const contentDiv = screen.getByTestId('quill-content');
      expect(contentDiv).toBeEmptyDOMElement();
    });

    test('updates project content when project prop is true', async () => {
      axios.put.mockResolvedValueOnce({ data: { success: true } });
      
      render(<TextEditor id={1} content={mockContent} project={true} />);
      
      const editor = screen.getByTestId('quill-editor');
      await userEvent.clear(editor);
      await userEvent.type(editor, 'Project content');
      
      const updateButton = screen.getByRole('button', { name: /insert/i });
      await userEvent.click(updateButton);
      
      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith(
          'http://localhost:3001/projects/updateProjectContent/1',
          { content: 'Project content', token: mockToken }
        );
      });
    });

    test('updates content when props change', () => {
      const { rerender } = render(<TextEditor id={1} content={mockContent} />);
      
      const newContent = '<p>New content</p>';
      rerender(<TextEditor id={1} content={newContent} />);
      
      const contentDiv = screen.getByTestId('quill-content');
      expect(contentDiv).toHaveTextContent('New content');
    });
  });
}); 