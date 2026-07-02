import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import TimesheetTable from '@/components/dashboard/TimesheetTable';
import { Timesheet } from '@/types';

// next/link is used inside the component — mock it to avoid router errors
jest.mock('next/link', () => {
  const MockLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

const mockTimesheets: Timesheet[] = [
  {
    id: 'ts-1',
    weekNumber: 1,
    startDate: '2024-01-01',
    endDate: '2024-01-05',
    status: 'COMPLETED',
    totalHours: 40,
    entries: [],
  },
  {
    id: 'ts-2',
    weekNumber: 2,
    startDate: '2024-01-08',
    endDate: '2024-01-12',
    status: 'INCOMPLETE',
    totalHours: 16,
    entries: [],
  },
  {
    id: 'ts-3',
    weekNumber: 3,
    startDate: '2024-01-15',
    endDate: '2024-01-19',
    status: 'MISSING',
    totalHours: 0,
    entries: [],
  },
];

describe('TimesheetTable', () => {
  it('shows empty state when no timesheets provided', () => {
    render(<TimesheetTable timesheets={[]} onOpenModal={jest.fn()} />);
    expect(screen.getByText(/no timesheets found/i)).toBeInTheDocument();
  });

  it('renders a View link for COMPLETED timesheets', () => {
    render(<TimesheetTable timesheets={[mockTimesheets[0]]} onOpenModal={jest.fn()} />);
    expect(screen.getAllByText('View').length).toBeGreaterThan(0);
  });

  it('renders an Update button for INCOMPLETE timesheets', () => {
    render(<TimesheetTable timesheets={[mockTimesheets[1]]} onOpenModal={jest.fn()} />);
    expect(screen.getAllByText('Update').length).toBeGreaterThan(0);
  });

  it('renders a Create button for MISSING timesheets', () => {
    render(<TimesheetTable timesheets={[mockTimesheets[2]]} onOpenModal={jest.fn()} />);
    expect(screen.getAllByText('Create').length).toBeGreaterThan(0);
  });

  it('calls onOpenModal with the correct id when Update is clicked', () => {
    const onOpenModal = jest.fn();
    render(<TimesheetTable timesheets={[mockTimesheets[1]]} onOpenModal={onOpenModal} />);
    fireEvent.click(screen.getAllByText('Update')[0]);
    expect(onOpenModal).toHaveBeenCalledWith('ts-2');
  });

  it('calls onOpenModal with the correct id when Create is clicked', () => {
    const onOpenModal = jest.fn();
    render(<TimesheetTable timesheets={[mockTimesheets[2]]} onOpenModal={onOpenModal} />);
    fireEvent.click(screen.getAllByText('Create')[0]);
    expect(onOpenModal).toHaveBeenCalledWith('ts-3');
  });
});
