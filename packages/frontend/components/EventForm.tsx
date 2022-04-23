import React, { useState } from 'react';
import { DateRangePicker, TimeRangeInput } from '@mantine/dates';
import {
  Box,
  Button,
  Grid,
  Group,
  InputWrapper,
  Paper,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { TimePicker } from 'antd';
import moment from 'moment';
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
          <Grid.Col span={8}>
            <DateRangePicker
              classNames={{
                input: 'py-[20.5px] text-[16px]',
              }}
              required
              label="Date Range"
              placeholder="Pick dates range"
              value={form.values.dateRange}
              onChange={(e) => form.setFieldValue('dateRange', [e[0], e[1]])}
              minDate={new Date()}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <InputWrapper label="Time Range" required>
              <div className="border-[#C3CAD1] border rounded">
                <TimePicker.RangePicker
                  clearIcon
                  bordered={false}
                  defaultValue={[
                    moment('09:00', 'HH:mm'),
                    moment('17:00', 'HH:mm'),
                  ]}
                  format="HH:mm"
                  showSecond={false}
                  minuteStep={30}
                  size={'large'}
                  onCalendarChange={(values) => {
                    const startHour = values?.[0]?.toDate();
                    const endHour = values?.[1]?.toDate();
                    form.setFieldValue('timeRange', [startHour!, endHour!]);
                  }}
                ></TimePicker.RangePicker>
              </div>
            </InputWrapper>
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
                form.setFieldValue('location', e.currentTarget.value)
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
