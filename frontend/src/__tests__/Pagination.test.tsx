import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '@/components/dashboard/Pagination';

const defaultProps = {
  page: 1,
  totalPages: 10,
  perPage: 5,
  onPageChange: jest.fn(),
  onPerPageChange: jest.fn(),
};

describe('Pagination', () => {
  beforeEach(() => jest.clearAllMocks());

  it('disables Previous button on first page', () => {
    render(<Pagination {...defaultProps} page={1} />);
    expect(screen.getByText('Previous')).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(<Pagination {...defaultProps} page={10} totalPages={10} />);
    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('calls onPageChange with next page when Next is clicked', () => {
    const onPageChange = jest.fn();
    render(<Pagination {...defaultProps} page={3} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('Next'));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange with previous page when Previous is clicked', () => {
    const onPageChange = jest.fn();
    render(<Pagination {...defaultProps} page={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('Previous'));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPerPageChange when rows-per-page selector changes', () => {
    const onPerPageChange = jest.fn();
    render(<Pagination {...defaultProps} onPerPageChange={onPerPageChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '10' } });
    expect(onPerPageChange).toHaveBeenCalledWith(10);
  });
});
