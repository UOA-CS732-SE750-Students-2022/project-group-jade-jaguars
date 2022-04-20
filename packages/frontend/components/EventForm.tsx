import React, { useState } from 'react';
import { DateRangePicker, TimeRangeInput } from '@mantine/dates';
import {
  Box,
  Button,
  Grid,
  Group,
  Paper,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
interface FormValues {
  title: string;
  dateRange: [Date | null, Date | null];
  timeRange: [Date, Date];
  description?: string;
  location?: string;
}
const EventForm = () => {
  const form = useForm<FormValues>({
    initialValues: {
      title: '',
      dateRange: [new Date(), new Date()],
      timeRange: [new Date(), new Date()],
      description: '',
      location: '',
    },
  });
  return (
    <Box sx={{ maxWidth: 700 }} mx="auto">
      <Paper p="xl" radius="md" withBorder>
        <Grid className="m-[50px]">
          <Grid.Col>
            <TextInput
              required
              label="Event Title"
              placeholder="add event title"
              value={form.values.title}
              onChange={(e) =>
                form.setFieldValue('title', e.currentTarget.value)
              }
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DateRangePicker
              required
              label="Date Range"
              placeholder="Pick dates range"
              value={form.values.dateRange}
              onChange={(e) => form.setFieldValue('dateRange', [e[0], e[1]])}
              minDate={new Date()}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TimeRangeInput
              label="Time Range"
              value={form.values.timeRange}
              onChange={(e) => form.setFieldValue('timeRange', [e[0], e[1]])}
              required
              clearable
            />
          </Grid.Col>
          <Grid.Col>
            <Textarea
              label="Description"
              placeholder="event details"
              autosize
              minRows={2}
              maxRows={4}
              value={form.values.description}
              onChange={(e) =>
                form.setFieldValue('description', e.currentTarget.value)
              }
            />
          </Grid.Col>
          <Grid.Col>
            <TextInput
              label="Location"
              placeholder="location or meeting link"
              value={form.values.location}
              onChange={(e) =>
                form.setFieldValue('description', e.currentTarget.value)
              }
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Group position="right" mt="lg">
              <Button
                classNames={{
                  filled: 'bg-[#FFDF74] hover:bg-[#FFDF74]',
                  label: 'text-black',
                }}
              >
                Done
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Paper>
    </Box>
  );
};

export default EventForm;
