import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ShareLinkButton } from '../../components/ShareLinkButton/ShareLinkButton';
import { Row, Col } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { AttendeeStatus } from '../../types/Availability';
import AvailabilitySelector from '../../components/AvailabilitySelector/AvailabilitySelector';
import GroupAvailability from '../../components/GroupAvailability/GroupAvailability';
import { useAuth } from '../../src/context/AuthContext';
import {
  AvailabilityBlock,
  AvailabilityStatusStrings,
} from '../../types/Availability';
import Event, { EventResponseDTO } from '../../types/Event';
import { TimeBracket, AttendeeAvailability } from '../../types/Event';
import socketio, { Socket } from 'socket.io-client';
import {
  getEvent,
  createAvailability,
  deleteAvailability,
  getUser,
} from '../../helpers/apiCalls/apiCalls';
import { getTZDate } from '../../helpers/timeFormatter';
import { Container } from '@mantine/core';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL!;

const Availability: NextPage = () => {
  const [timeOptions, setTimeOptions] = useState<TimeBracket>({
    startDate: new Date('2022-05-01T21:00:00.000Z'),
    endDate: new Date('2022-05-05T05:00:00.000Z'),
  });

  const [myAvailability, setMyAvailability] = useState<AvailabilityBlock[]>([]);
  const [allAvailabilities, setAllAvailabilities] = useState<
    AttendeeAvailability[]
  >([]);

  const [eventTitle, setEventTitle] = useState<String>('Event Title');
  const [pageNum, setPageNum] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(1);

  const { userId, authToken } = useAuth();
  const [isAdmin, setIsAdmin] = useState<Boolean>(false);

  const router = useRouter();
  const {
    query: { eventId },
  } = router;

  const [io, setIO] = useState<Socket>();

  async function fetchData() {
    let startDate = timeOptions.startDate;
    let endDate = timeOptions.endDate;
    let myAvailability: AvailabilityBlock[] = [];
    let allAvailabilities: AttendeeAvailability[] = [];
    let eventTitle = 'Event Title';
    let newFinalisedTime;
    const val: EventResponseDTO = await getEvent(eventId!.toString());
    eventTitle = val.title;
    if (val.admin === userId) {
      setIsAdmin(true);
    }
    startDate = getTZDate(val.startDate);
    endDate = getTZDate(val.endDate);
    newFinalisedTime = val.availability!.finalisedTime;

    setNumPages(
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24 * 7),
      ),
    );

    allAvailabilities = val ? val!.availability!.attendeeAvailability! : [];
    if (
      allAvailabilities.find((attendee) => {
        return attendee.attendee === userId;
      })
    ) {
      myAvailability = allAvailabilities.find((attendee) => {
        return attendee.attendee === userId;
      })!.availability;
    }
    setEventTitle(eventTitle);
    setTimeOptions({
      startDate: startDate,
      endDate: endDate,
    });
    setMyAvailability(myAvailability);
    setAllAvailabilities(allAvailabilities);
    return newFinalisedTime;
  }

  useEffect(() => {
    fetchData()
      .then((newFinalisedTime) => {
        if (newFinalisedTime) {
          router.push({
            pathname: '/finalised/',
            query: { eventId: eventId },
          });
        }
      })
      .catch(console.error);

    setIO(
      socketio(SOCKET_URL, {
        extraHeaders: {
          Authorization: 'Bearer ' + authToken,
        },
      }),
    );
  }, [eventId]);

  useEffect(() => {
    io?.on(`event:${eventId}`, (args: Event) => {
      console.log(args);
      setAllAvailabilities(args!.availability!.attendeeAvailability!);
    });
  }, [io]);

  const [status, setStatus] = useState<AvailabilityStatusStrings>(
    AvailabilityStatusStrings.Available,
  );
  const [info, setInfo] = useState<JSX.Element[]>([]);

  function finaliseTimes() {
    io?.disconnect();
    router.push({
      pathname: '/timeFinalisation/',
      query: { eventId: eventId },
    });
  }

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

  const handleSelection = async (selection: {
    startDate: Date;
    endDate: Date;
  }) => {
    const startTime = new Date(selection.startDate);
    startTime.setHours(startTime.getHours() + 12);
    const endTime = new Date(selection.endDate);
    endTime.setHours(endTime.getHours() + 12);
    endTime.setMinutes(endTime.getMinutes() + 30);

    await createAvailability(eventId!.toString(), {
      startDate: startTime.toISOString(),
      endDate: endTime.toISOString(),
      status: status,
      userId: userId,
    });

    return true;
  };

  const handleDeletion = async (deletion: {
    startDate: Date;
    endDate: Date;
  }) => {
    const startTime = new Date(deletion.startDate);
    startTime.setHours(startTime.getHours() + 12);
    const endTime = new Date(deletion.endDate);
    endTime.setHours(endTime.getHours() + 12);
    endTime.setMinutes(endTime.getMinutes() + 30);

    await deleteAvailability(eventId!.toString(), {
      userId: userId,
      startDate: startTime.toISOString(),
      endDate: endTime.toISOString(),
    });

    return true;
  };

  const handlePageChange = (pageNum: number) => {
    fetchData().catch(console.error);
    setPageNum(pageNum);
  };

  const isAvailabilityEmpty = () => {
    return (
      allAvailabilities.length == 0 ||
      !allAvailabilities.every((attendee) => {
        return attendee.availability.length;
      })
    );
  };

  return (
    <Container>
      <div className="flex flex-col w-full gap-20 justify-center py-28 items-center">
        <div className="mb-[10px] flex flex-row gap-10 w-full justify-start mr-52">
          <h1 className="mr-[30px] my-0 leading-none">
            <span className="font-normal text-[25px]">Event name: </span>
            {eventTitle}
          </h1>
          <ShareLinkButton eventLink={eventId} text={eventId} />
        </div>

        <div className="flex flex-row gap-20 ml-[150px] justify-center items-start">
          <section className="w-[500px]">
            <div>
              <div className="flex flex-row items-center ml-14 w-[84%] justify-between">
                <p className="font-medium text-xl">Your Availability</p>
                <div className="flex flex-row gap-2">
                  <button
                    className={
                      'bg-primary text-black w-[100px] cursor-pointer text-sm rounded-lg px-2 py-2 font-medium hover:bg-primarylight ' +
                      (status === AvailabilityStatusStrings.Available
                        ? 'border-black'
                        : '')
                    }
                    onClick={() =>
                      setStatus(AvailabilityStatusStrings.Available)
                    }
                  >
                    <p>Available</p>
                  </button>
                  <button
                    className={
                      'bg-secondary text-black w-[100px] cursor-pointer text-sm rounded-lg px-2 py-2 font-medium hover:bg-secondarylight ' +
                      (status === AvailabilityStatusStrings.Tentative
                        ? 'border-black'
                        : '')
                    }
                    onClick={() =>
                      setStatus(AvailabilityStatusStrings.Tentative)
                    }
                  >
                    <p>Maybe</p>
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center w-[500px]">
                <AvailabilitySelector
                  timeOptions={timeOptions}
                  availability={myAvailability}
                  status={status}
                  pageNum={pageNum}
                  selectionHandler={handleSelection}
                  deletionHandler={handleDeletion}
                />
                <div className="flex flex-row ml-5 w-[84%] justify-between">
                  <button
                    className={
                      'bg-secondary text-black w-[30px] cursor-pointer rounded-md px-2 py-1 font-semibold hover:bg-secondarylight' +
                      (pageNum > 1 ? 'block' : 'hidden')
                    }
                    onClick={() => handlePageChange(pageNum - 1)}
                  >
                    {'<'}
                  </button>
                  <button
                    className={
                      'bg-secondary text-black w-[30px] cursor-pointer rounded-md px-2 py-1 font-semibold hover:bg-secondarylight' +
                      (pageNum < numPages ? 'block' : 'hidden')
                    }
                    onClick={() => handlePageChange(pageNum + 1)}
                  >
                    {'>'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-row gap-5">
            <div>
              <div className="flex flex-row ml-14 w-[84%] justify-between">
                <h2 className="font-medium text-xl">Group Availability</h2>
                <h2 className="ml-[50px]">
                  {isAvailabilityEmpty() ? '0' : allAvailabilities.length}
                </h2>
              </div>

              <GroupAvailability
                timeOptions={timeOptions}
                availabilities={allAvailabilities}
                pageNum={pageNum}
                onHover={handleHover}
              />

              <div className="flex flex-col items-end justify-end mr-7">
                <button
                  className={
                    'bg-secondary text-black w-[100px] cursor-pointer rounded-md px-2 py-3 font-medium hover:bg-secondarylight' +
                    (isAdmin && !isAvailabilityEmpty() ? 'block' : 'hidden')
                  }
                  onClick={() => finaliseTimes()}
                >
                  <p>Finalise</p>
                </button>
              </div>
            </div>

            <div className="w-[200px] h-fit max-h-[500px] overflow-scroll">
              {info.flatMap((val) => {
                return val;
              })}
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
};

export default Availability;
