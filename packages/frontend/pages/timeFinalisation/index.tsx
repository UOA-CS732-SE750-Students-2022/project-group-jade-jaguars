import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Row, Col, Text } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { AttendeeStatus } from '../../types/Availability';
import GroupAvailability from '../../components/GroupAvailability/GroupAvailability';
import { useAuth } from '../../src/context/AuthContext';
import { AvailabilityStatusStrings } from '../../types/Availability';
import {
  TimeBracket,
  AttendeeAvailability,
  EventResponseDTO,
} from '../../types/Event';
import {
  getEvent,
  getUser,
  finaliseEventTime,
} from '../../helpers/apiCalls/apiCalls';
import { TimeOptionsList } from '../../components/TimeOptionsList/TimeOptionsList';
import { getTZDate } from '../../helpers/timeFormatter';
import { DatePicker } from '@mantine/dates';
import { Container, Grid, InputWrapper } from '@mantine/core';
import { TimePicker } from 'antd';
import moment from 'moment';

const BASE_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

const TimeFinalisation: NextPage = () => {
  const [timeOptions, setTimeOptions] = useState<TimeBracket>({
    startDate: new Date('2022-05-01T21:00:00.000Z'),
    endDate: new Date('2022-05-05T05:00:00.000Z'),
  });

  const [potentialTimes, setPotentialTimes] = useState<TimeBracket[]>([]);

  const [allAvailabilities, setAllAvailabilities] = useState<
    AttendeeAvailability[]
  >([]);

  const [eventTitle, setEventTitle] = useState<String>('Event Title');
  const [pageNum, setPageNum] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(1);

  const [selectedTimes, setSelectedTimes] = useState<TimeBracket>();
  const [date, setDateChange] = useState<Date | null>(new Date());
  const [timeRange, setTimeRange] = useState<Date[] | undefined>();
  const [customEvent, setCustomEvent] = useState<boolean>(false);
  const [dtError, setDtError] = useState<boolean>(false);

  const { userId } = useAuth();

  const router = useRouter();
  const {
    query: { eventId },
  } = router;

  async function fetchData() {
    let startDate = timeOptions.startDate;
    let endDate = timeOptions.endDate;
    let allAvailabilities: AttendeeAvailability[] = [];
    let eventTitle = 'Event Title';
    let potentialTimes: TimeBracket[] = [];
    const val: EventResponseDTO = await getEvent(eventId!.toString());
    eventTitle = val.title;
    startDate = getTZDate(val.startDate);
    endDate = getTZDate(val.endDate);

    setNumPages(
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24 * 7),
      ),
    );

    allAvailabilities = val ? val!.availability!.attendeeAvailability! : [];
    potentialTimes = val!.availability!.potentialTimes
      ? val!.availability!.potentialTimes!
      : [];
    setEventTitle(eventTitle);
    setTimeOptions({
      startDate: startDate,
      endDate: endDate,
    });
    setAllAvailabilities(allAvailabilities);
    setPotentialTimes(potentialTimes);
  }

  useEffect(() => {
    fetchData().catch(console.error);
  }, [eventId]);

  const [info, setInfo] = useState<JSX.Element[]>([]);

  const handleHover = async (peopleInfo: {
    people: AttendeeStatus[];
    numPeople: number;
  }) => {
    async function getInfoMap() {
      const infoMap = peopleInfo.people.map(async (person, index) => {
        let { firstName, lastName } = await getUser(person.uuid);
        firstName = firstName ? firstName : 'first name';
        lastName = lastName ? lastName : 'last name';
        return (
          <p key={index} className="block">
            {firstName +
              ' ' +
              lastName +
              ': ' +
              AvailabilityStatusStrings[person.status]}
          </p>
        );
      });
      Promise.all(infoMap).then((values: JSX.Element[]) => {
        setInfo(values);
      });
    }
    getInfoMap();
  };

  const handlePageChange = (pageNum: number) => {
    fetchData().catch(console.error);
    setPageNum(pageNum);
  };

  const confirmSelection = async () => {
    let dtError = false;
    if (customEvent) {
      if (
        date == null ||
        timeRange == undefined ||
        timeRange[0] == null ||
        timeRange[1] == null
      ) {
        dtError = true;
        setDtError(dtError);
      } else {
        const startDate = new Date(date);
        const endDate = new Date(date);
        const startTime = timeRange[0];
        const endTime = timeRange[1];
        startDate.setHours(startTime.getHours(), startTime.getMinutes());
        endDate.setHours(endTime.getHours(), endTime.getMinutes());
        const startDateText = startDate.toISOString();
        const endDateText = endDate.toISOString();
        await finaliseEventTime(eventId!.toString(), {
          startDate: getTZDate(new Date(startDateText)),
          endDate: getTZDate(new Date(endDateText)),
        });
      }
    } else {
      await finaliseEventTime(eventId!.toString(), selectedTimes!);
    }
    if (!dtError) {
      router.push({
        pathname: `/finalised`,
        query: { eventId: eventId },
      });
    }
  };

  return (
    <Container style={{ maxWidth: '100vw' }} className="m-0 ml-[100px] p-0">
      <div className="min-w-[1200px] flex flex-col w-full gap-20 items-center py-28">
        <div className="w-full flex flex-col items-center">
          <h1 className="mr-[30px] my-0 leading-none">
            Finalise your event time!
          </h1>

          <p className="mr-[30px] text-[28px] my-0 font-medium leading-none mt-[40px]">
            <span className="text-lg font-normal">Event name: </span>
            {eventTitle}
          </p>
        </div>

        <div className="flex flex-row gap-20">
          <section className="flex flex-col gap-2">
            <div>
              <div className="flex flex-row justify-start">
                <h2 className="text-xl ml-20">Group Availability</h2>
              </div>

              <div className="flex flex-row">
                <GroupAvailability
                  timeOptions={timeOptions}
                  availabilities={allAvailabilities}
                  pageNum={pageNum}
                  onHover={handleHover}
                />
                <div className="w-[180px] mt-14 flex flex-col items-center h-fit">
                  <h2 className="flex flex-row justify-between w-full mb-8">
                    <p>Participants: </p>
                    {allAvailabilities.length}
                  </h2>
                  <div className="max-h-[500px] overflow-y-scroll">
                    {info.length > 0 ? (
                      info.flatMap((val) => {
                        return val;
                      })
                    ) : (
                      <div className="text-center text-[15px]">
                        Hover to view availability information
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                className={
                  'bg-secondary text-black w-[30px] cursor-pointer rounded-md px-2 py-1 font-semibold hover:bg-secondarylight absolute right-[80px] ' +
                  (pageNum > 1 ? 'block' : 'hidden')
                }
                onClick={() => handlePageChange(pageNum - 1)}
              >
                {'<'}
              </button>
              <button
                className={
                  'bg-secondary text-black w-[30px] cursor-pointer rounded-md px-2 py-1 font-semibold hover:bg-secondarylight absolute right-0 mr-[30px] ' +
                  (pageNum < numPages ? 'block' : 'hidden')
                }
                onClick={() => handlePageChange(pageNum + 1)}
              >
                {'>'}
              </button>
            </div>
          </section>

          <section className="flex flex-col w-full">
            <div className="flex flex-col gap-2 h-fit">
              <p className="font-medium text-xl">Options</p>
              <TimeOptionsList
                isCustomTime={customEvent}
                options={potentialTimes}
                setCheckedTime={setSelectedTimes}
              />
            </div>

            <div className="flex flex-col mt-5 gap-2 w-full">
              <button
                className={
                  'bg-secondary text-black w-[180px] cursor-pointer rounded-md mt-2 px-2 py-2 font-base hover:bg-secondarylight absolute'
                }
                onClick={() => setCustomEvent(!customEvent)}
              >
                <p>Custom Event Time</p>
              </button>

              <div className="mt-16 flex gap-2 flex-row w-[85%]">
                <DatePicker
                  classNames={{
                    input: 'py-[20.5px] text-[16px]',
                  }}
                  className={customEvent ? 'block' : 'hidden'}
                  required
                  label="Event date"
                  placeholder="Pick event date"
                  value={date}
                  onChange={(e) => setDateChange(e)}
                  minDate={new Date()}
                />

                <InputWrapper
                  label="Time Range"
                  required
                  className={customEvent ? 'block' : 'hidden'}
                >
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
                        setTimeRange([startHour!, endHour!]);
                      }}
                    ></TimePicker.RangePicker>
                  </div>
                </InputWrapper>
              </div>
              <Text color="warning" className={dtError ? 'block' : 'hidden'}>
                Please specify a date and time range for your event
              </Text>
            </div>

            <div className="w-full flex justify-end mt-20">
              {selectedTimes && (
                <button
                  className={
                    'bg-secondary text-black w-[100px] cursor-pointer rounded-md px-2 py-3 font-medium hover:bg-secondarylight'
                  }
                  onClick={() => confirmSelection()}
                >
                  <p>Confirm</p>
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
};

export default TimeFinalisation;
