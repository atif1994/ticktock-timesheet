import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import StatusBadge from '@/components/dashboard/StatusBadge';

describe('StatusBadge', () => {
  it('renders COMPLETED with green styling', () => {
    render(<StatusBadge status="COMPLETED" />);
    const badge = screen.getByText('COMPLETED');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-100', 'text-green-700');
  });

  it('renders INCOMPLETE with orange styling', () => {
    render(<StatusBadge status="INCOMPLETE" />);
    const badge = screen.getByText('INCOMPLETE');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-orange-100', 'text-orange-600');
  });

  it('renders MISSING with red styling', () => {
    render(<StatusBadge status="MISSING" />);
    const badge = screen.getByText('MISSING');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100', 'text-red-500');
  });
});
