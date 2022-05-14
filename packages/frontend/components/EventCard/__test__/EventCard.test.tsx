import { render, screen } from '@testing-library/react';
import EventCard from '../EventCard';

it('renders a EventCard', () => {
  // setup
  const participants = [
    {
      name: 'Amy',
    },
    {
      name: 'Bob',
    },
  ];

  render(
    <EventCard
      title={'Test event'}
      date={new Date('01/01/2022')}
      timeRange={[new Date('01/01/2022 13:30'), new Date('01/01/2022 15:30')]}
      participants={participants}
      description={'This is a test description'}
    />,
  );

  const title = screen.getByText(/test event/i); // regular expression, ignores cases
  const description = screen.getByText(/This is a test description/i);
  const participantName = screen.getByText(/amy/i);
  const dateTime = screen.getByText('01/01/2022, 13:30 - 15:30 NZDT');

  expect(title).toBeInTheDocument();
  expect(description).toBeInTheDocument();
  expect(participantName).toBeInTheDocument();
  expect(dateTime).toBeInTheDocument();
});
