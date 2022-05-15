import { useState, useEffect, useRef, MouseEventHandler } from 'react';
import { AttendeeAvailability, TimeBracket } from '../../types/Event';
import {
  AttendeeStatus,
  AvailabilityStatusStrings,
} from '../../types/Availability';

/*
 *  Assumption: no more than 7 days sent through as timeOptions.
 *  Props: timeOptions: a list of times that can be selected.
 *         availabilities: a list of availabilities for all users.
 *         onHover: a function returning the info about the timeslot to the page.
 */
function GroupAvailability(props: {
  timeOptions: TimeBracket;
  availabilities: AttendeeAvailability[];
  pageNum: number;
  onHover: (info: { people: AttendeeStatus[]; numPeople: number }) => void;
}) {
  const [timeList, setTimeList] = useState<TimeBracket[]>([]);
  const [hourList, setHourList] = useState<string[]>([]);

  // The status of the grid.
  const [timeSlots, setTimeSlots] = useState<
    {
      row: number;
      col: number;
      percentAvailable: number;
      people: AttendeeStatus[];
    }[]
  >([]);

  const [numCols, setNumCols] = useState<number>(0);

  const [numPeople, setNumPeople] = useState<number>(0);

  // Initialise the grid.
  useEffect(() => {
    const startTime = new Date(props.timeOptions.startDate);
    startTime.setDate(startTime.getDate() + (props.pageNum - 1) * 7);
    const endTime = new Date(props.timeOptions.startDate);

    let lastTime = new Date(props.timeOptions.endDate);

    if (
      (props.timeOptions.endDate.getTime() - startTime.getTime()) /
        (1000 * 3600 * 24) >
      7
    ) {
      lastTime = new Date(startTime);
      lastTime.setDate(startTime.getDate() + 6);
      lastTime.setHours(props.timeOptions.endDate.getHours());
      lastTime.setMinutes(props.timeOptions.endDate.getMinutes());
    }

    endTime.setHours(lastTime.getHours());
    endTime.setMinutes(lastTime.getMinutes());

    let halfHours = (endTime.getHours() - startTime.getHours()) * 2;

    if (startTime.getMinutes() == 30) {
      halfHours--;
    }
    if (endTime.getMinutes() == 30) {
      halfHours++;
    }

    if (halfHours === 0) {
      halfHours = 48;
    }

    // timeList will contain the list of potential times split up among different days.
    let timeList: TimeBracket[] = [];

    const daysInTB =
      (lastTime.getTime() - startTime.getTime()) / (1000 * 3600 * 24); // How many days to split into.

    // Separate out each day.
    for (let i = 0; i < daysInTB; i++) {
      let myEndTime = new Date(lastTime);
      if (
        startTime.getHours() == 0 &&
        myEndTime.getHours() == 0 &&
        startTime.getMinutes() == 0 &&
        myEndTime.getMinutes() == 0
      ) {
        myEndTime.setDate(startTime.getDate() + 1);
      } else {
        myEndTime.setDate(startTime.getDate());
      }
      let newStartTime = new Date(startTime);
      let newEndTime = new Date(myEndTime);
      timeList.push({
        startDate: newStartTime,
        endDate: newEndTime,
      });
      startTime.setDate(startTime.getDate() + 1);
    }

    let initialTimeSlots: {
      row: number;
      col: number;
      percentAvailable: number;
      people: AttendeeStatus[];
    }[] = [];

    const numDays = timeList.length;
    const numPeople = props.availabilities.length;

    // Map the time slots to grid items.
    for (let i = 0; i < halfHours; i++) {
      for (let j = 0; j < numDays; j++) {
        const day = new Date(timeList[j].startDate);
        let time = day.getHours() + 0.5 * i;
        if (day.getMinutes() == 30) {
          time += 0.5;
        }
        let hours;
        let mins;
        if (time % 1 === 0) {
          hours = time;
          mins = 0;
        } else {
          hours = time - 0.5;
          mins = 30;
        }
        const dateTime = new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate(),
          hours,
          mins,
        );

        let percentAvailable = 0;
        let people: AttendeeStatus[] = [];
        // Check whether each user is available at this time.
        for (let i in props.availabilities) {
          for (let j in props.availabilities[i].availability) {
            if (
              props.availabilities[i].availability[j].status ==
              AvailabilityStatusStrings.Unavailable
            )
              continue;
            const startDT = new Date(
              new Date(props.availabilities[i].availability[j].startDate)
                .toISOString()
                .slice(0, 19)
                .replace('Z', ' '),
            );
            const endDT = new Date(
              new Date(props.availabilities[i].availability[j].endDate)
                .toISOString()
                .slice(0, 19)
                .replace('Z', ' '),
            );
            if (dateTime >= startDT && dateTime < endDT) {
              if (
                props.availabilities[i].availability[j].status ==
                AvailabilityStatusStrings.Available
              ) {
                percentAvailable += 1 / numPeople;
                people.push({
                  uuid: props.availabilities[i].attendee,
                  status: AvailabilityStatusStrings.Available,
                });
              } else {
                percentAvailable += 1 / (2 * numPeople);
                people.push({
                  uuid: props.availabilities[i].attendee,
                  status: AvailabilityStatusStrings.Tentative,
                });
              }
              break;
            }
          }
        }
        initialTimeSlots.push({
          row: i,
          col: j,
          percentAvailable: percentAvailable,
          people: people,
        });
      }
    }

    const startDate = new Date(timeList[0].startDate);
    const endDate = new Date(timeList[0].endDate);

    let hourList: string[] = [];
    let mins = '00';

    if (startDate.getMinutes() == 30) {
      mins = '30';
    }

    let end = endDate.getHours();

    if (endDate.getHours() === 0) {
      end = 24;
    }

    for (let i = startDate.getHours(); i < end; i++) {
      let hour = i;
      if (i > 12) {
        hour = i - 12;
      }
      if (mins === '30' && i != startDate.getHours()) {
        hourList.push(hour.toString() + ':00');
      }
      hourList.push(hour.toString() + ':' + mins);
      if (mins === '00' && i !== 24) {
        hourList.push(hour.toString() + ':30');
      }
    }

    setHourList(hourList);
    setNumCols(numDays);
    setTimeList(timeList);
    setTimeSlots(initialTimeSlots);
    setNumPeople(numPeople);
  }, [props]);

  function handleHover(row: number, col: number) {
    const timeSlot = timeSlots.find(
      (timeSlot) => timeSlot.row === row && timeSlot.col === col,
    );
    const info = {
      people: timeSlot!.people,
      numPeople: numPeople,
    };
    props.onHover(info);
  }

  return (
    <div className="m-[30px]">
      <div
        className="grid h-[20px] ml-[30px]"
        style={{ gridTemplateColumns: 'repeat(' + numCols + ', 60px)' }}
      >
        {timeList.map((timeBracket, index) => {
          const startDate = new Date(timeBracket.startDate);
          return (
            <div
              className="w-[60px] h-[20px] text-[12px] z-1 block text-black text-center"
              key={index}
            >
              {startDate.getDate()}/{startDate.getMonth() + 1}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex' }}>
        <div
          className="grid w-[30px] m-0 p-0"
          style={{ gridTemplateColumns: 'repeat(1, 30px)' }}
        >
          {hourList.map((hour, index) => (
            <div
              className="w-[30px] h-[20px] text-[12px] z-1 block text-black text-center"
              key={index}
            >
              {hour}
            </div>
          ))}
        </div>
        <div
          className="grid m-0"
          style={{ gridTemplateColumns: 'repeat(' + numCols + ', 60px)' }}
        >
          {timeSlots.map((timeSlot, index) => (
            <div
              className={
                'w-px-60 h-px-20 block border border-solid border-black z-1 ' +
                (() => {
                  if (timeSlot.percentAvailable === 0) {
                    return 'bg-white';
                  } else {
                    return 'bg-primary';
                  }
                })()
              }
              key={index}
              style={{
                opacity: (() => {
                  if (timeSlot.percentAvailable === 0) {
                    return 1;
                  } else {
                    return timeSlot.percentAvailable;
                  }
                })(),
              }}
              onMouseEnter={() => handleHover(timeSlot.row, timeSlot.col)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GroupAvailability;
