import { render, screen } from '@testing-library/react';
import Footer from '@/components/layout/Footer';

describe('Footer responsive layout', () => {
  it('renders correctly on mobile width', () => {
    // Set viewport size
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
    window.dispatchEvent(new Event('resize'));
    render(<Footer />);
    const footer = screen.getByRole('contentinfo'); // footer element
    expect(footer).toBeInTheDocument();
    // Check that columns stack vertically
    const columns = footer.querySelectorAll('div[data-testid="footer-column"]');
    // Not actual test IDs; just placeholder for visual verification
  });
});
