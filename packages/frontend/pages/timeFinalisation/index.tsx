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
import { Grid, InputWrapper } from '@mantine/core';
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
    <div>
      <Row>
        <h1 className="mr-[30px] my-0 leading-none">
          Finalise your event time!
        </h1>
      </Row>
      <Row align="baseline" className="mb-[10px]">
        <h1 className="mr-[30px] my-0 leading-none mt-[10px]">{eventTitle}</h1>
      </Row>
      <Row gap={1}>
        <Col>
          <Row>
            <Col>
              <h2>Group Availability</h2>
            </Col>
            <Col>
              <h2 className="ml-[50px]">{allAvailabilities.length}</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <GroupAvailability
                timeOptions={timeOptions}
                availabilities={allAvailabilities}
                pageNum={pageNum}
                onHover={handleHover}
              />
            </Col>
            <Col>
              {info.flatMap((val) => {
                return val;
              })}
            </Col>
          </Row>
          <Row>
            <button
              className={
                'bg-secondary text-black w-[30px] cursor-pointer rounded-md px-2 py-1 font-semibold hover:bg-secondarylight absolute right-[70px] ' +
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
          </Row>
        </Col>
        <Col>
          Options
          <Row>
            <TimeOptionsList
              options={potentialTimes}
              setCheckedTime={setSelectedTimes}
            />
          </Row>
          <Row className="mt-[15px]">
            <button
              className={
                'bg-secondary text-black w-[180px] cursor-pointer rounded-md px-2 py-1 font-semibold hover:bg-secondarylight absolute'
              }
              onClick={() => setCustomEvent(!customEvent)}
            >
              Custom Event Time
            </button>
          </Row>
          <Row className="max-w-[400px] mt-[30px]">
            <Col>
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
            </Col>
            <Col>
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
            </Col>
          </Row>
          <Row>
            <Text color="warning" className={dtError ? 'block' : 'hidden'}>
              Please specify a date and time range for your event
            </Text>
          </Row>
          <Row>
            <button
              className={
                'bg-secondary text-black w-[100px] cursor-pointer rounded-md px-2 py-1 font-semibold hover:bg-secondarylight absolute right-0 mr-[120px] mt-[55px] ' +
                (selectedTimes ? 'block' : 'hidden')
              }
              onClick={() => confirmSelection()}
            >
              Confirm {'>'}
            </button>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default TimeFinalisation;
