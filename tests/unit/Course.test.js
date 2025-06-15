import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Course from '@components/course';
import axios from 'axios';
import { useRouter } from 'next/navigation';

jest.mock('axios');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

process.env.API_HOST = 'http://localhost:3001/';

describe('Course Component', () => {
  const mockPush = jest.fn();
  const mockUser = { id: 1, admin: true };
  const mockToken = 'mock-token';
  const mockCourse = {
    course: {
      id: 1,
      course_title: 'Test Course',
      UserCour: { starred: false, progress: 0.5 }
    },
    lessons: [],
    projects: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({
      push: mockPush,
    });
    
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

    axios.get.mockResolvedValue({ data: mockCourse });
  });

  describe('Course Operations', () => {
    test('creates a new course', async () => {
      const mockImageResponse = { data: { url: 'http://example.com/image.jpg' } };
      const mockCourseResponse = { data: { course_title: 'New Course' } };
      
      axios.post.mockResolvedValueOnce(mockImageResponse);
      axios.put.mockResolvedValueOnce(mockCourseResponse);

      render(<Course id={1} />);
      
      await waitFor(() => {
        expect(screen.getByText('Test Course')).toBeInTheDocument();
      });

      const speedDial = screen.getByLabelText('SpeedDial basic example');
      await act(async () => {
        fireEvent.click(speedDial);
      });

      const editAction = screen.getByTestId('EditIcon').closest('button');
      await act(async () => {
        fireEvent.click(editAction);
      });

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/name/i);
        const fileInput = screen.getByLabelText(/choose a file/i, { exact: false });
        expect(nameInput).toBeInTheDocument();
        expect(fileInput).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/name/i);
      const fileInput = screen.getByLabelText(/choose a file/i, { exact: false });
      
      await act(async () => {
        await userEvent.type(nameInput, 'Updated Course');
        
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        await userEvent.upload(fileInput, file);
      });
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'https://api-eu.cloudinary.com/v1_1/ds2qt32nd/image/upload',
          expect.any(FormData)
        );
        expect(axios.put).toHaveBeenCalledWith(
          'http://localhost:3001/courses/updateCourse/1',
          expect.objectContaining({
            course_id: 1,
            course_title: 'Updated Course',
            course_image_url: 'http://example.com/image.jpg',
            token: mockToken
          })
        );
      });
    });

    test('edits an existing course', async () => {
      const mockImageResponse = { data: { url: 'http://example.com/image.jpg' } };
      const mockCourseResponse = { data: { course_title: 'Updated Course' } };
      
      axios.post.mockResolvedValueOnce(mockImageResponse);
      axios.put.mockResolvedValueOnce(mockCourseResponse);

      render(<Course id={1} />);
      
      await waitFor(() => {
        const speedDial = screen.getByLabelText('SpeedDial basic example');
        expect(speedDial).toBeInTheDocument();
      });

      const speedDial = screen.getByLabelText('SpeedDial basic example');
      await act(async () => {
        fireEvent.click(speedDial);
      });

      const editAction = screen.getByTestId('EditIcon').closest('button');
      await act(async () => {
        fireEvent.click(editAction);
      });

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/name/i);
        expect(nameInput).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/name/i);
      await act(async () => {
        await userEvent.type(nameInput, 'Updated Course Title');
      });
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith(
          'http://localhost:3001/courses/updateCourse/1',
          expect.objectContaining({
            course_id: 1,
            course_title: 'Updated Course Title',
            course_image_url: 'http://example.com/image.jpg',
            token: mockToken
          })
        );
      });
    });

    test('deletes a course', async () => {
      axios.put.mockResolvedValueOnce({ data: { success: true } });

      render(<Course id={1} />);
      
      await waitFor(() => {
        const speedDial = screen.getByLabelText('SpeedDial basic example');
        expect(speedDial).toBeInTheDocument();
      });

      const speedDial = screen.getByLabelText('SpeedDial basic example');
      await act(async () => {
        fireEvent.click(speedDial);
      });

      const deleteAction = screen.getByTestId('DeleteIcon').closest('button');
      await act(async () => {
        fireEvent.click(deleteAction);
      });

      await waitFor(() => {
        const deleteButton = screen.getByRole('button', { name: /delete course/i });
        expect(deleteButton).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /delete course/i });
      await act(async () => {
        fireEvent.click(deleteButton);
      });

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith(
          'http://localhost:3001/courses/deleteCourse/1',
          { token: mockToken }
        );
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });
  });

  describe('Course Content', () => {
    test('creates a new lesson', async () => {
      const mockLessonResponse = { data: { id: 1, lesson_title: 'New Lesson' } };
      axios.post.mockResolvedValueOnce(mockLessonResponse);

      render(<Course id={1} />);
      
      await waitFor(() => {
        const speedDial = screen.getByLabelText('SpeedDial basic example');
        expect(speedDial).toBeInTheDocument();
      });

      const speedDial = screen.getByLabelText('SpeedDial basic example');
      await act(async () => {
        fireEvent.click(speedDial);
      });

      const createLessonAction = screen.getByTestId('ImportContactsIcon').closest('button');
      await act(async () => {
        fireEvent.click(createLessonAction);
      });

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/name/i);
        expect(nameInput).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/name/i);
      await act(async () => {
        await userEvent.type(nameInput, 'New Lesson');
      });
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3001/lessons/createLesson',
          expect.objectContaining({
            lesson_title: 'New Lesson',
            course_id: 1,
            token: mockToken
          })
        );
      });
    });

    test('creates a new project', async () => {
      const mockProjectResponse = { data: { id: 1, project_title: 'New Project' } };
      axios.post.mockResolvedValueOnce(mockProjectResponse);

      render(<Course id={1} />);
      
      await waitFor(() => {
        const speedDial = screen.getByLabelText('SpeedDial basic example');
        expect(speedDial).toBeInTheDocument();
      });

      const speedDial = screen.getByLabelText('SpeedDial basic example');
      await act(async () => {
        fireEvent.click(speedDial);
      });

      const createProjectAction = screen.getByTestId('CodeIcon').closest('button');
      await act(async () => {
        fireEvent.click(createProjectAction);
      });

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/name/i);
        expect(nameInput).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/name/i);
      await act(async () => {
        await userEvent.type(nameInput, 'New Project');
      });
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3001/projects/createProject',
          expect.objectContaining({
            project_title: 'New Project',
            course_id: 1,
            token: mockToken
          })
        );
      });
    });
  });
}); 