import React, { useState } from 'react';
import { DateRangePicker } from '@mantine/dates';
import {
  Box,
  Button,
  Grid,
  Group,
  InputWrapper,
  Paper,
  Select,
  Textarea,
  TextInput,
} from '@mantine/core';
import { TimePicker } from 'antd';
import moment from 'moment';
import { UseForm } from '@mantine/hooks/lib/use-form/use-form';
import Event from '../types/Event';
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

type TeamInfo = {
  id: string;
  label: string;
};

interface EventFormProps {
  teamData?: TeamInfo[];
  form: UseForm<FormValues>;
  isEdit?: boolean;
  eventId?: string;
  onSubmit: (param?: any) => void;
}
const EventForm = ({
  teamData,
  form,
  isEdit,
  eventId,
  onSubmit,
}: EventFormProps) => {
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
          {!isEdit && teamData && (
            <Grid.Col sm={4} mt={30} xs={12}>
              <label
                htmlFor="default-toggle"
                className="inline-flex relative items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  value=""
                  id="default-toggle"
                  className="sr-only peer"
                  checked={form.values.newTeam}
                  onChange={(event) =>
                    form.setFieldValue('newTeam', event.currentTarget.checked)
                  }
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0   rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                <span className="ml-3 text-sm font-medium text-black ">
                  New Team
                </span>
              </label>
            </Grid.Col>
          )}
          {!isEdit && teamData && (
            <Grid.Col sm={8} xs={12}>
              {form.values.newTeam ? (
                <TextInput
                  required
                  label="New Team Name"
                  value={form.values.newTeamName}
                  onChange={(e) =>
                    form.setFieldValue('newTeamName', e.currentTarget.value)
                  }
                />
              ) : (
                <Select
                  data={teamData.map((team) => team.label)}
                  label="Select a Team"
                  value={form.values.teamName}
                  onChange={(e) => form.setFieldValue('teamName', e!)}
                />
              )}
            </Grid.Col>
          )}
          {!isEdit && teamData && (
            <Grid.Col sm={8} xs={12}>
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
          )}
          {!isEdit && teamData && (
            <Grid.Col sm={4} xs={12}>
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
          )}
          <Grid.Col>
            <Textarea
              required
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
              required
              label="Location"
              placeholder="location or meeting link"
              value={form.values.location}
              onChange={(e) =>
                form.setFieldValue('location', e.currentTarget.value)
              }
            />
          </Grid.Col>
          <Grid.Col sm={5} mt={20} xs={12}>
            <label
              htmlFor="default-toggle2"
              className="inline-flex relative items-center cursor-pointer"
            >
              <input
                type="checkbox"
                value=""
                id="default-toggle2"
                className="sr-only peer"
                checked={form.values.recurring}
                onChange={(event) => {
                  form.setFieldValue('recurring', event.currentTarget.checked);
                  console.log(form.values.recurring);
                }}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0   rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              <span className="ml-3  text-sm font-medium text-black ">
                Weekly
              </span>
              <span className="ml-1  text-sm font-medium text-black ">
                Recurrence
              </span>
            </label>
          </Grid.Col>
          <Grid.Col sm={7} xs={12}>
            <Group position="right" mt="lg">
              <Button
                classNames={{
                  filled: 'bg-[#FFDF74] hover:bg-[#FFDF74]',
                  label: 'text-black',
                }}
                onClick={() =>
                  onSubmit({ form: form.values, eventId: eventId })
                }
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
