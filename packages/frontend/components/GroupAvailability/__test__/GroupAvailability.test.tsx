import { render, screen } from '@testing-library/react';
import GroupAvailability from '../GroupAvailability';
import {
  AttendeeStatus,
  AvailabilityBlock,
  AvailabilityStatusStrings,
} from '../../../types/Availability';
import { TimeBracket, AttendeeAvailability } from '../../../types/Event';

it('GroupAvailability details render and display correctly', () => {
  // setup
  const timeOptions: TimeBracket = {
    startDate: new Date('2022-05-02T09:00:00.000+00:00'),
    endDate: new Date('2022-05-06T17:00:00.000+00:00'),
  };

  const allAvailabilities: AttendeeAvailability[] = [
    {
      attendee: '12345',
      availability: [
        {
          startDate: new Date('2022-05-02T09:30:00.000+00:00'),
          endDate: new Date('2022-05-02T11:00:00.000+00:00'),
          status: AvailabilityStatusStrings.Available,
        },
      ],
      confirmed: true,
    },
  ];

  const handleHover = (info: {
    people: AttendeeStatus[];
    numPeople: number;
  }) => {};

  // create a component with example props
  render(
    <GroupAvailability
      timeOptions={timeOptions}
      availabilities={allAvailabilities}
      pageNum={1}
      onHover={handleHover}
    />,
  );

  // get what you want to test using methods such as getByText(), see more test methods in the documentation https://testing-library.com/docs/queries/bytext
  const firstDate = screen.getByText(/2\/5/i);
  const lastDate = screen.getByText(/6\/5/i);

  const grids = document.querySelectorAll('.grid');

  const mainAndDateGrid = document.querySelectorAll(
    '[style="grid-template-columns: repeat(5, 60px);"]',
  );
  const timeGrid = document.querySelector(
    '[style="grid-template-columns: repeat(1, 30px);"]',
  );

  // test if the elements above are in the documentation
  expect(firstDate).toBeInTheDocument();
  expect(lastDate).toBeInTheDocument();
  expect(grids).toHaveLength(3);
  expect(mainAndDateGrid).toHaveLength(2);
  expect(timeGrid).toBeInTheDocument();
});
