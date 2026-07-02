import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Filters from '@/components/dashboard/Filters';

const defaultProps = {
  statusFilter: 'all' as const,
  dateFrom: '',
  dateTo: '',
  onStatusChange: jest.fn(),
  onDateFromChange: jest.fn(),
  onDateToChange: jest.fn(),
};

describe('Filters', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the status dropdown with All Statuses selected', () => {
    render(<Filters {...defaultProps} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('all');
  });

  it('calls onStatusChange when a status is selected', () => {
    const onStatusChange = jest.fn();
    render(<Filters {...defaultProps} onStatusChange={onStatusChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'COMPLETED' } });
    expect(onStatusChange).toHaveBeenCalledWith('COMPLETED');
  });

  it('does not show Clear button when no filters are active', () => {
    render(<Filters {...defaultProps} />);
    expect(screen.queryByText('Clear')).not.toBeInTheDocument();
  });

  it('shows Clear button when a status filter is active', () => {
    render(<Filters {...defaultProps} statusFilter="COMPLETED" />);
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('resets all filters when Clear is clicked', () => {
    const onStatusChange = jest.fn();
    const onDateFromChange = jest.fn();
    const onDateToChange = jest.fn();
    render(
      <Filters
        {...defaultProps}
        statusFilter="MISSING"
        onStatusChange={onStatusChange}
        onDateFromChange={onDateFromChange}
        onDateToChange={onDateToChange}
      />
    );
    fireEvent.click(screen.getByText('Clear'));
    expect(onStatusChange).toHaveBeenCalledWith('all');
    expect(onDateFromChange).toHaveBeenCalledWith('');
    expect(onDateToChange).toHaveBeenCalledWith('');
  });
});
