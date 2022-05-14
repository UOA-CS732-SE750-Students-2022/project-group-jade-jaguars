import { render, screen } from '@testing-library/react';
import EventCard from '../EventCard';

it('EventCard details render and display correctly', () => {
  // setup
  const participants = [
    {
      name: 'Amy',
    },
    {
      name: 'Bob',
    },
  ];

  // create a component with example props
  render(
    <EventCard
      title={'Test event'}
      date={new Date('01/01/2022')}
      timeRange={[new Date('01/01/2022 13:30'), new Date('01/01/2022 15:30')]}
      participants={participants}
      description={'This is a description'}
    />,
  );

  // get what you want to test using methods such as getByText(), see more test methods in the documentation https://testing-library.com/docs/queries/bytext
  const title = screen.getByText(/test event/i); // regular expression, ignores cases
  const description = screen.getByText(/This is a description/i);
  const participantName = screen.getByText(/amy/i);
  //const dateTime = screen.getByText('01/01/2022, 13:30 - 15:30 NZDT');

  // test if the elements above are in the documentation
  expect(title).toBeInTheDocument();
  expect(description).toBeInTheDocument();
  expect(participantName).toBeInTheDocument();
  //expect(dateTime).toBeInTheDocument();
});
