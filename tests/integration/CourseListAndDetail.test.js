import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CourseList from '@components/courseList';
import CourseUI from '@components/course';
import axios from 'axios';
import { useRouter } from 'next/navigation';

jest.mock('axios');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));


jest.mock('next/link', () => {
  return function MockedLink({ children, href, ...props }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});


process.env.API_HOST = 'http://localhost:3001/';

describe('Course List and Detail Integration', () => {
  const mockPush = jest.fn();
  const mockUser = { id: 1, admin: true };
  const mockToken = 'mock-token';
  const mockCourses = [
    {
      id: 1,
      course_title: 'Test Course 1',
      deleted: 0
    },
    {
      id: 2,
      course_title: 'Test Course 2',
      deleted: 0
    }
  ];

  const mockCourseDetail = {
    course: {
      id: 1,
      course_title: 'Test Course 1',
      UserCour: { starred: false, progress: 0.5 }
    },
    lessons: [
      { id: 1, lesson_title: 'Lesson 1' }
    ],
    projects: [
      { id: 1, project_title: 'Project 1' }
    ]
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

    axios.get.mockImplementation((url) => {
      if (url.includes('courses/byId/1/1')) {
        return Promise.resolve({ data: mockCourseDetail });
      }
      return Promise.resolve({ data: [] });
    });
  });

  test('displays course list with correct navigation links', async () => {
    render(<CourseList courses={mockCourses} />);

    await waitFor(() => {
      expect(screen.getByText('Test Course 1')).toBeInTheDocument();
      expect(screen.getByText('Test Course 2')).toBeInTheDocument();
    });

    const firstCourseLink = screen.getByText('Test Course 1').closest('a');
    const secondCourseLink = screen.getByText('Test Course 2').closest('a');
    
    expect(firstCourseLink).toHaveAttribute('href', 'course/1');
    expect(secondCourseLink).toHaveAttribute('href', 'course/2');
  });

  test('course detail component renders correctly', async () => {

    render(<CourseUI id={1} />);

    await waitFor(() => {
      expect(screen.getByText('Test Course 1')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/courses/byId/1/1');

    await waitFor(() => {
      expect(screen.getByText('Lesson 1')).toBeInTheDocument();
    });


    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument();
    });
  });

  test('course detail shows loading state initially', async () => {

    axios.get.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({ data: mockCourseDetail }), 100)
      )
    );

    render(<CourseUI id={1} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Course 1')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('show more/less functionality in course list', async () => {
    const manyCourses = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      course_title: `Test Course ${i + 1}`,
      deleted: 0
    }));

    render(<CourseList courses={manyCourses} />);

    await waitFor(() => {
      expect(screen.getByText('Test Course 1')).toBeInTheDocument();
      expect(screen.getByText('Test Course 6')).toBeInTheDocument();

      const allCourseContainers = document.querySelectorAll('.course-list');
      const extraCoursesContainer = allCourseContainers[1]; 
      expect(extraCoursesContainer).toHaveClass('less');
      expect(screen.queryByText('Test Course 8')).toBeInTheDocument();
    });

    const showMoreButton = screen.getByText('Show More');
    await act(async () => {
      fireEvent.click(showMoreButton);
    });

    await waitFor(() => {
      const allCourseContainers = document.querySelectorAll('.course-list');
      const extraCoursesContainer = allCourseContainers[1]; 
      expect(extraCoursesContainer).not.toHaveClass('less');
      expect(screen.getByText('Test Course 8')).toBeInTheDocument();
    });

    const showLessButton = screen.getByText('Show Less');
    await act(async () => {
      fireEvent.click(showLessButton);
    });

    await waitFor(() => {
      const allCourseContainers = document.querySelectorAll('.course-list');
      const extraCoursesContainer = allCourseContainers[1]; 
      expect(extraCoursesContainer).toHaveClass('less');
    });
  });

  test('course list handles deleted courses correctly', async () => {
    const coursesWithDeleted = [
      {
        id: 1,
        course_title: 'Active Course',
        deleted: 0
      },
      {
        id: 2,
        course_title: 'Deleted Course',
        deleted: 1
      }
    ];

    render(<CourseList courses={coursesWithDeleted} />);

    await waitFor(() => {
      expect(screen.getByText('Active Course')).toBeInTheDocument();
      expect(screen.queryByText('Deleted Course')).not.toBeInTheDocument();
    });
  });
}); 