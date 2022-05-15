import { render, screen } from '@testing-library/react';
import { ShareLinkButton } from '../ShareLinkButton';

it('ShareLinkButton details render and display correctly', () => {
  render(<ShareLinkButton eventLink={'https://google.com'} />);

  const prompt = screen.getByText(/Share Event/i);

  expect(prompt).toBeInTheDocument();
});
