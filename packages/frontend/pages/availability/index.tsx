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
import User from '../../types/User';
import { useForceUpdate } from '@mantine/hooks';

const Availability: NextPage = () => {
  const [timeOptions, setTimeOptions] = useState<TimeBracket>({
    startDate: new Date('2022-05-01T21:00:00.000Z'),
    endDate: new Date('2022-05-05T05:00:00.000Z'),
  });

  const [myAvailability, setMyAvailability] = useState<AvailabilityBlock[]>([]);
  const [allAvailabilities, setAllAvailabilities] = useState<
    AttendeeAvailability[]
  >([]);

  const [pageNum, setPageNum] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(1);

  const { userId } = useAuth();
  const [isAdmin, setIsAdmin] = useState<Boolean>(false);

  const token =
    'eyJhbGciOiJSUzI1NiIsImtpZCI6ImJlYmYxMDBlYWRkYTMzMmVjOGZlYTU3ZjliNWJjM2E2YWIyOWY1NTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY291bnQtbWUtaW4tNTk3ODUiLCJhdWQiOiJjb3VudC1tZS1pbi01OTc4NSIsImF1dGhfdGltZSI6MTY1MTk3NzEzNCwidXNlcl9pZCI6Ikt5elZ4amc2N1JVSWhuaGlsSU5UVXhJd3pXMTIiLCJzdWIiOiJLeXpWeGpnNjdSVUlobmhpbElOVFV4SXd6VzEyIiwiaWF0IjoxNjUxOTc3MTM0LCJleHAiOjE2NTE5ODA3MzQsImVtYWlsIjoiYXNkczZAYXNkLmFzZGFhYXNzIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFzZHM2QGFzZC5hc2RhYWFzcyJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.bjtQa4m2fO58tFCH8Yxzok4SmtEbu0PqFEsC4fft9P4ua66aTx1gre_oZKXUpwTIz4Sa01brblQM1C6uzYA-QYnTHH0GRdZoB7_oa_BOpOASFgRTJo6ZNKs29NcW1EDj5K5i8JyObZVC3JE_C6NH3Zys51I7yfBJzaRedxSy-ofL0bbtfycUCLlvVlwh4X11mqqYnPhV_G9t6XRmYwXHxHR5670a3WfV6PCirMgjzqeaKOdjIHOrpRU_sWnneUcvG8U6CS4QVlYxI1MIqRrNWDxdsykdjJg1o_io1MB5zatA_yzgg_6HIouAMTFaA3qCsAO_CItSlHTFEePy-9m8Kw';

  const router = useRouter();
  const {
    query: { eventId },
  } = router;

  useEffect(() => {
    async function fetchData() {
      let startDate = timeOptions.startDate;
      let endDate = timeOptions.endDate;
      let myAvailability: AvailabilityBlock[] = [];
      let allAvailabilities: AttendeeAvailability[] = [];
      await getEvent(eventId!.toString()).then((val: Event) => {
        if (val.admin === userId) {
          setIsAdmin(true);
        }
        startDate = new Date(
          new Date(val.startDate).toISOString().slice(0, 19).replace('Z', ' '),
        );
        endDate = new Date(
          new Date(val.endDate).toISOString().slice(0, 19).replace('Z', ' '),
        );

        setNumPages(
          Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24 * 7),
          ),
        );

        allAvailabilities = val.availability.attendeeAvailability!;
        if (
          allAvailabilities.find((attendee) => {
            return attendee.attendee === userId;
          })
        ) {
          myAvailability = allAvailabilities.find((attendee) => {
            return attendee.attendee === userId;
          })!.availability;
        }
      });
      setTimeOptions({
        startDate: startDate,
        endDate: endDate,
      });
      setMyAvailability(myAvailability);
      setAllAvailabilities(allAvailabilities);
    }

    fetchData().catch(console.error);

    const io = socketio('http://localhost:3000');
    io.on(`event:${eventId}`, (args) => {
      console.log('event changed');
      console.log(args);
      setAllAvailabilities(args.availability.attendeeAvailability);
    });
    console.log(`listening to event: ${eventId}`);
  }, [eventId]);

  const [status, setStatus] = useState<AvailabilityStatusStrings>(
    AvailabilityStatusStrings.Available,
  );
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
              AvailabilityStatusStrings[status]}
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
  };

  return (
    <div>
      <Row align="baseline" className="mb-[10px]">
        <h1 className="mr-[30px] my-0 leading-none">Event Title</h1>
        <ShareLinkButton eventLink={'https://www.google.com/'} />
      </Row>
      <Row>
        <Col>
          <Row>
            <Col>
              <h2>Your Availability</h2>
            </Col>
            <Col>
              <Row>
                <button
                  className={
                    'bg-primary text-black border-2 w-[100px] cursor-pointer rounded-md px-2 py-1 font-semibold hover:bg-primarylight ' +
                    (status === AvailabilityStatusStrings.Available
                      ? 'border-black'
                      : '')
                  }
                  onClick={() => setStatus(AvailabilityStatusStrings.Available)}
                >
                  Available
                </button>
              </Row>
              <Row>
                <button
                  className={
                    'bg-secondary text-black border-2 w-[100px] cursor-pointer rounded-md px-2 py-1 font-semibold hover:bg-secondarylight ' +
                    (status === AvailabilityStatusStrings.Tentative
                      ? 'border-black'
                      : '')
                  }
                  onClick={() => setStatus(AvailabilityStatusStrings.Tentative)}
                >
                  Maybe
                </button>
              </Row>
            </Col>
          </Row>
          <Row>
            <AvailabilitySelector
              timeOptions={timeOptions}
              availability={myAvailability}
              status={status}
              pageNum={pageNum}
              selectionHandler={handleSelection}
              deletionHandler={handleDeletion}
            />
          </Row>
          <Row>
            <button
              className={
                'bg-secondary text-black w-[30px] cursor-pointer rounded-md px-2 py-1 font-semibold hover:bg-secondarylight absolute right-[70px] ' +
                (pageNum > 1 ? 'block' : 'hidden')
              }
              onClick={() => setPageNum(pageNum - 1)}
            >
              {'<'}
            </button>
            <button
              className={
                'bg-secondary text-black w-[30px] cursor-pointer rounded-md px-2 py-1 font-semibold hover:bg-secondarylight absolute right-0 mr-[30px] ' +
                (pageNum < numPages ? 'block' : 'hidden')
              }
              onClick={() => setPageNum(pageNum + 1)}
            >
              {'>'}
            </button>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col>
              <h2 className="mb-[35px]">Group Availability</h2>
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
                'bg-secondary text-black w-[100px] cursor-pointer rounded-md px-2 py-1 font-semibold hover:bg-secondarylight absolute right-0 ' +
                (isAdmin ? 'block' : 'hidden')
              }
              onClick={() => console.log('finalise')}
            >
              Finalise {'>'}
            </button>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Availability;
