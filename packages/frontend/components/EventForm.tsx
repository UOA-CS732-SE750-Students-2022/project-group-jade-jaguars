import React, { useState } from 'react';
import { DateRangePicker, TimeRangeInput } from '@mantine/dates';
import { Box, Grid, Textarea, TextInput } from '@mantine/core';
import dayjs from 'dayjs';
interface FormValues {
  title: string;
  dates: Date[];
  // time:
}
const EventForm = () => {
  const [value, setValue] = useState<[Date | null, Date | null]>([
    new Date(),
    new Date(),
  ]);
  return (
    <Box sx={{ maxWidth: 500 }} mx="auto">
      <Grid>
        <Grid.Col>
          <TextInput label="Event Title" placeholder="Add event title" />
        </Grid.Col>
        <Grid.Col span={6}>
          <DateRangePicker
            label="Date Range"
            placeholder="Pick dates range"
            value={value}
            onChange={setValue}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TimeRangeInput label="Time Range" />
        </Grid.Col>
        <Grid.Col>
          <Textarea
            label="Description"
            placeholder="Event Details"
            autosize
            minRows={2}
            maxRows={4}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput label="Location" placeholder="location/meeting link" />
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default EventForm;
