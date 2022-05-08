import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ShareLinkButton } from '../../components/ShareLinkButton';
import { Row, Col } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { AttendeeStatus } from '../../types/Availability';
import AvailabilitySelector from '../../components/AvailabilitySelector';
import GroupAvailability from '../../components/GroupAvailability';
import axios from 'axios';
import { useAuth } from '../../src/context/AuthContext';
import {
  Event,
  TimeBracket,
  AttendeeAvailability,
  AvailabilityBlock,
  AvailabilityStatus,
} from '../../types/Event';
import socketio from 'socket.io-client';
import { InputStatus } from 'antd/lib/_util/statusUtils';

//   const availability: AvailabilityBlock[] = [
//     {
//       startDate: 1650232800000,
//       endDate: 1650250800000,
//       status: AvailabilityStatus.Available,
//     },
//     {
//       startDate: 1650250800000,
//       endDate: 1650258000000,
//       status: AvailabilityStatus.Unavailable,
//     },
//     {
//       startDate: 1650315600000,
//       endDate: 1650344400000,
//       status: AvailabilityStatus.Unavailable,
//     },
//     {
//       startDate: 1650402000000,
//       endDate: 1650430800000,
//       status: AvailabilityStatus.Tentative,
//     },
//     {
//       startDate: 1650488400000,
//       endDate: 1650517200000,
//       status: AvailabilityStatus.Unavailable,
//     },
//     {
//       startDate: 1650574800000,
//       endDate: 1650603600000,
//       status: AvailabilityStatus.Unavailable,
//     },
//   ];

// const availabilities: AttendeeAvailability[] = [
//     {
//         uuid: 'Brad',
//         availability: [
//           {
//             startDate: 1650232800000,
//             endDate: 1650250800000,
//             status: AvailabilityStatus.Available,
//           },
//           {
//             startDate: 1650402000000,
//             endDate: 1650430800000,
//             status: AvailabilityStatus.Tentative,
//           },
//         ],
//     },
//     {
//         uuid: 'Chad',
//         availability: [
//             {
//                 startDate: 1650243600000,
//                 endTime: 1650254400000,
//                 status: AvailabilityStatus.Available,
//             },
//             {
//                 startDate: 1650405600000,
//                 endDate: 1650423600000,
//                 status: AvailabilityStatus.Available,
//             },
//             {
//                 startDate: 1650495600000,
//                 endDate: 1650517200000,
//                 status: AvailabilityStatus.Tentative,
//             },
//         ],
//     },
// ];

const Availability: NextPage = () => {
  const [timeOptions, setTimeOptions] = useState<TimeBracket>({
    startDate: new Date('2022-05-01T21:00:00.000Z'),
    endDate: new Date('2022-05-05T05:00:00.000Z'),
  });

  const [myAvailability, setMyAvailability] = useState<AvailabilityBlock[]>([]);
  const [allAvailabilities, setAllAvailabilities] = useState<
    AttendeeAvailability[]
  >([]);

  const { userId } = useAuth();

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
      await axios
        .get('http://149.28.170.219/api/v1/event/' + eventId, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((val: { data: Event }) => {
          startDate = new Date(new Date(val.data.startDate).toISOString());
          endDate = new Date(new Date(val.data.endDate).toISOString());

          allAvailabilities = val.data.availability.attendeeAvailability;
          if (
            allAvailabilities.find((attendee) => {
              attendee.attendee === userId;
            })
          ) {
            myAvailability = allAvailabilities.find((attendee) => {
              attendee.attendee === userId;
            })!.availability;
          }
        });
      // setTimeOptions({
      //   startDate: startDate,
      //   endDate: endDate,
      // });
      setMyAvailability(myAvailability);
      setAllAvailabilities(allAvailabilities);
    }

    fetchData().catch(console.error);

    const io = socketio('http://149.28.170.219');
    io.on(`event:${eventId}`, (args) => {
      console.log('event changed');
      console.log(args);
      setAllAvailabilities(args.availability.attendeeAvailability);
    });
    console.log(`listening to event: ${eventId}`);
  }, [eventId]);

  const [status, setStatus] = useState<AvailabilityStatus>(
    AvailabilityStatus.Available,
  );
  const [info, setInfo] = useState<String[]>([]);

  const handleHover = (info: {
    people: AttendeeStatus[];
    numPeople: number;
  }) => {
    setInfo(
      info.people.map((person, index) => {
        return person.uuid + ': ' + AvailabilityStatus[status];
      }),
    );
  };

  const handleSelection = async (selection: {
    startDate: Date;
    endDate: Date;
  }) => {
    await axios
      .post(
        '/event/' + eventId + '/availability',
        {
          userId: userId,
          startDate: selection.startDate,
          endDate: selection.endDate,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleDeletion = async (deletion: {
    startDate: Date;
    endDate: Date;
  }) => {
    await axios
      .delete('/event/' + eventId + '/availability', {
        params: {
          userId: userId,
          startDate: deletion.startDate,
          endDate: deletion.endDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
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
                    (status === AvailabilityStatus.Available
                      ? 'border-black'
                      : '')
                  }
                  onClick={() => setStatus(AvailabilityStatus.Available)}
                >
                  Available
                </button>
              </Row>
              <Row>
                <button
                  className={
                    'bg-secondary text-black border-2 w-[100px] cursor-pointer rounded-md px-2 py-1 font-semibold hover:bg-secondarylight ' +
                    (status === AvailabilityStatus.Tentative
                      ? 'border-black'
                      : '')
                  }
                  onClick={() => setStatus(AvailabilityStatus.Tentative)}
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
              selectionHandler={handleSelection}
              deletionHandler={handleDeletion}
            />
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
                onHover={handleHover}
              />
            </Col>
            <Col>
              {info.map((val, index) => {
                return <p key={index}>{val}</p>;
              })}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Availability;
