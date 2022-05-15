import { render, screen } from '@testing-library/react';
import AvailabilitySelector from '../AvailabilitySelector';
import {
  AvailabilityBlock,
  AvailabilityStatusStrings,
} from '../../../types/Availability';
import { TimeBracket } from '../../../types/Event';

it('AvailabilitySelector details render and display correctly', async () => {
  // setup
  const timeOptions: TimeBracket = {
    startDate: new Date('2022-05-02T09:00:00.000+00:00'),
    endDate: new Date('2022-05-06T17:00:00.000+00:00'),
  };

  const myAvailability: AvailabilityBlock[] = [
    {
      startDate: new Date('2022-05-02T09:30:00.000+00:00'),
      endDate: new Date('2022-05-02T11:00:00.000+00:00'),
      status: AvailabilityStatusStrings.Available,
    },
  ];

  const handleFunctions = async (selection: {
    startDate: Date;
    endDate: Date;
  }) => {
    return true;
  };

  // create a component with example props
  render(
    <AvailabilitySelector
      timeOptions={timeOptions}
      availability={myAvailability}
      status={AvailabilityStatusStrings.Available}
      pageNum={1}
      selectionHandler={handleFunctions}
      deletionHandler={handleFunctions}
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
