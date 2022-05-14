import { useForm } from '@mantine/hooks';
import { render, screen } from '@testing-library/react';
import EventForm from '../EventForm';

it('EventForm details render and displayt correctly', () => {
  interface FormValues {
    title: string;
    dateRange: [Date | null, Date | null];
    timeRange: [Date, Date];
    description?: string;
    location?: string;
    newTeam: boolean;
    newTeamName: string;
    teamName?: string;
    recurring: boolean;
  }
  const defaultStartTime = new Date();
  const defaultEndTime = new Date();
  defaultStartTime.setHours(9, 0, 0, 0);
  defaultEndTime.setHours(17, 0, 0, 0);
  const form = useForm<FormValues>({
    initialValues: {
      title: '',
      dateRange: [new Date(), new Date()],
      timeRange: [defaultStartTime, defaultEndTime],
      description: '',
      location: '',
      newTeam: false,
      teamName: '',
      newTeamName: '',
      recurring: false,
    },
  });

  render(
    <EventForm
      teamData={[]}
      form={form}
      onCreateEvent={function (): void {
        throw new Error('Function not implemented.');
      }}
    />,
  );

  const eventTitle = screen.getByText(/Event Title/i);
  const newTeam = screen.getByText(/New Team/i);
  const selectTeam = screen.getByText(/Select a Team/i);
  const description = screen.getByText(/Description/i);
  const location = screen.getByText(/Location/i);
  const recurrence = screen.getByText(/Weekly Recurrence/i);
  const doneButton = screen.getByText(/Done/i);

  expect(eventTitle).toBeInTheDocument();
  expect(newTeam).toBeInTheDocument();
  expect(selectTeam).toBeInTheDocument();
  expect(description).toBeInTheDocument();
  expect(location).toBeInTheDocument();
  expect(recurrence).toBeInTheDocument();
  expect(doneButton).toBeInTheDocument();
});
