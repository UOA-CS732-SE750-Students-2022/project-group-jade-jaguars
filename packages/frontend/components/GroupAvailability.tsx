import { useState, useEffect, useRef, MouseEventHandler } from 'react';
import {
  AttendeeAvailability,
  AvailabilityStatus,
  AttendeeStatus,
} from '../types/Availability';
import TimeBracket from '../types/TimeBracket';

/*
 *  Assumption: no more than 7 days sent through as timeOptions.
 *  Props: timeOptions: a list of times that can be selected.
 *         availabilities: a list of availabilities for all users.
 *         onHover: a function returning the info about the timeslot to the page.
 */
function GroupAvailability(props: {
  timeOptions: TimeBracket[];
  availabilities: AttendeeAvailability[];
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
    const startTime = new Date(props.timeOptions[0].startTime);
    const endTime = new Date(props.timeOptions[0].endTime);

    let halfHours = (endTime.getHours() - startTime.getHours()) * 2;

    if (startTime.getMinutes() == 30) {
      halfHours--;
    }
    if (endTime.getMinutes() == 30) {
      halfHours++;
    }

    // timeList will contain the list of potential times split up among different days.
    let timeList = props.timeOptions;

    // If the time brackets are between midnight and midnight, need to split up the days.
    if (
      !(
        endTime.getFullYear() === startTime.getFullYear() &&
        endTime.getMonth() === startTime.getMonth() &&
        endTime.getDate() === startTime.getDate()
      )
    ) {
      timeList = [];
      // Check each set of time brackets.
      for (let index in props.timeOptions) {
        let myStartTime = new Date(props.timeOptions[index].startTime);
        const finalEndTime = new Date(props.timeOptions[index].endTime);
        const daysInTB =
          (finalEndTime.getTime() - myStartTime.getTime()) / (1000 * 3600 * 24); // How many days to split into.

        // Separate out each day.
        for (let i = 0; i < daysInTB; i++) {
          let myEndTime = new Date(myStartTime);
          myEndTime.setDate(myStartTime.getDate() + 1);
          timeList.push({
            startTime: myStartTime.getTime(),
            endTime: myEndTime.getTime(),
          });
          myStartTime.setTime(myEndTime.getTime());
        }
      }
      halfHours = 48;
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
        const day = new Date(timeList[j].startTime);
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
              AvailabilityStatus.Unavailable
            )
              continue;
            const startDT = new Date(
              props.availabilities[i].availability[j].startTime,
            );
            const endDT = new Date(
              props.availabilities[i].availability[j].endTime,
            );
            if (dateTime >= startDT && dateTime < endDT) {
              if (
                props.availabilities[i].availability[j].status ==
                AvailabilityStatus.Available
              ) {
                percentAvailable += 1 / numPeople;
                people.push({
                  uuid: props.availabilities[i].uuid,
                  status: AvailabilityStatus.Available,
                });
              } else {
                percentAvailable += 1 / (2 * numPeople);
                people.push({
                  uuid: props.availabilities[i].uuid,
                  status: AvailabilityStatus.Tentative,
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

    const startDate = new Date(timeList[0].startTime);
    const endDate = new Date(timeList[0].endTime);

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
    <div>
      <div
        className="grid h-[20px] ml-[30px]"
        style={{ gridTemplateColumns: 'repeat(' + numCols + ', 60px)' }}
      >
        {timeList.map((timeBracket, index) => {
          const startDate = new Date(timeBracket.startTime);
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
              className="w-px-60 h-px-20 block border border-solid border-black z-1"
              key={index}
              style={{
                backgroundColor: (() => {
                  if (timeSlot.percentAvailable === 0) {
                    return 'white';
                  } else {
                    return 'green';
                  }
                })(),
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
