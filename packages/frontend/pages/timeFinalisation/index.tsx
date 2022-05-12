import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ShareLinkButton } from '../../components/ShareLinkButton';
import { Row, Col } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { AttendeeStatus } from '../../types/Availability';
import AvailabilitySelector from '../../components/AvailabilitySelector';
import GroupAvailability from '../../components/GroupAvailability';
import { useAuth } from '../../src/context/AuthContext';
import {
  AvailabilityBlock,
  AvailabilityStatusStrings,
} from '../../types/Availability';
import Event from '../../types/Event';
import { TimeBracket, AttendeeAvailability } from '../../types/Event';
import socketio from 'socket.io-client';
import {
  getEvent,
  createAvailability,
  deleteAvailability,
  getUser,
} from '../../helpers/apiCalls/apiCalls';

const TimeFinalisation: NextPage = () => {
  const [timeOptions, setTimeOptions] = useState<TimeBracket>({
    startDate: new Date('2022-05-01T21:00:00.000Z'),
    endDate: new Date('2022-05-05T05:00:00.000Z'),
  });

  const [allAvailabilities, setAllAvailabilities] = useState<
    AttendeeAvailability[]
  >([]);

  const [eventTitle, setEventTitle] = useState<String>('Event Title');
  const [pageNum, setPageNum] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(1);

  const { userId } = useAuth();
  const [isAdmin, setIsAdmin] = useState<Boolean>(false);

  const router = useRouter();
  const {
    query: { eventId },
  } = router;

  const getTZDate = (date: Date) => {
    return new Date(
      new Date(date).toISOString().slice(0, 19).replace('Z', ' '),
    );
  };

  async function fetchData() {
    let startDate = timeOptions.startDate;
    let endDate = timeOptions.endDate;
    let allAvailabilities: AttendeeAvailability[] = [];
    let eventTitle = 'Event Title';
    await getEvent(eventId!.toString()).then((val: Event) => {
      eventTitle = val.title;
      if (val.admin === userId) {
        setIsAdmin(true);
      }
      startDate = getTZDate(val.startDate);
      endDate = getTZDate(val.endDate);

      setNumPages(
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24 * 7),
        ),
      );

      allAvailabilities = val ? val!.availability!.attendeeAvailability! : [];
    });
    setEventTitle(eventTitle);
    setTimeOptions({
      startDate: startDate,
      endDate: endDate,
    });
    setAllAvailabilities(allAvailabilities);
  }

  useEffect(() => {
    fetchData().catch(console.error);

    const io = socketio('http://localhost:3000');
    io.on(`event:${eventId}`, (args: Event) => {
      console.log('event changed');
      console.log(args);
      setAllAvailabilities(args!.availability!.attendeeAvailability!);
    });
    console.log(`listening to event: ${eventId}`);
  }, [eventId]);

  const [info, setInfo] = useState<JSX.Element[]>([]);

  const handleHover = async (peopleInfo: {
    people: AttendeeStatus[];
    numPeople: number;
  }) => {
    async function getInfoMap() {
      const infoMap = peopleInfo.people.map(async (person, index) => {
        const { firstName, lastName } = await getUser(person.uuid);
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

  return (
    <div>
      <Row align="baseline" className="mb-[10px]">
        <h1 className="mr-[30px] my-0 leading-none">{eventTitle}</h1>
        <ShareLinkButton eventLink={'https://www.google.com/'} />
      </Row>
      <Row>
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
          <Row></Row>
        </Col>
      </Row>
    </div>
  );
};

export default TimeFinalisation;
