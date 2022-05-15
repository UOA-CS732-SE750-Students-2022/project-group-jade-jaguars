import { render, screen } from '@testing-library/react';
import { TimeOptionCheckBox } from '../TimeOptionCheckBox';
import { TimeOptionsList } from '../TimeOptionsList';

it('Each checkbox renders and displays correctly', () => {
  render(
    <TimeOptionCheckBox
      option={'CountMeIn'}
      active={false}
      onClick={jest.fn()}
    />,
  );

  const label = screen.getByText(/CountMeIn/i);

  expect(label);
});
