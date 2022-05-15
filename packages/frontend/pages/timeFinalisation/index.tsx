import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Row, Col } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { AttendeeStatus } from '../../types/Availability';
import GroupAvailability from '../../components/GroupAvailability';
import { useAuth } from '../../src/context/AuthContext';
import { AvailabilityStatusStrings } from '../../types/Availability';
import Event from '../../types/Event';
import { TimeBracket, AttendeeAvailability } from '../../types/Event';
import socketio from 'socket.io-client';
import {
  getEvent,
  getUser,
  finaliseEventTime,
} from '../../helpers/apiCalls/apiCalls';
import { TimeOptionsList } from '../../components/TimeOptionsList';
import { getTZDate } from '../../helpers/timeFormatter';

const BASE_URL = process.env.SERVER_URL;

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

  const { userId } = useAuth();

  const router = useRouter();
  const {
    query: { eventId },
  } = router;

  const io = socketio(BASE_URL!);

  async function fetchData() {
    let startDate = timeOptions.startDate;
    let endDate = timeOptions.endDate;
    let allAvailabilities: AttendeeAvailability[] = [];
    let eventTitle = 'Event Title';
    let potentialTimes: TimeBracket[] = [];
    const val = await getEvent(eventId!.toString());
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
    await finaliseEventTime(eventId!.toString(), selectedTimes!);
    io.disconnect();
    router.push({
      pathname: `/finalised`,
      query: { eventId: eventId },
    });
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
          <Row>Options</Row>
          <Row>
            <TimeOptionsList
              options={potentialTimes}
              setCheckedTime={setSelectedTimes}
            />
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
