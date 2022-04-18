import { useState, useEffect, useRef } from 'react';
import {
  AvailabilityBlock,
  AvailabilityStatus,
} from '../types/AvailabilityBlock';
import TimeBracket from '../types/TimeBracket';

function AvailabilitySelector(props: {
  potentialTimes: TimeBracket[];
  availability: AvailabilityBlock[];
  status: AvailabilityStatus;
}) {
  const firstRender = useRef(true);
  const [selecting, setSelecting] = useState<Boolean>(false);
  const [start, setStart] = useState<number[]>([-1, -1]);
  const [timeSlots, setTimeSlots] = useState<
    {
      row: number;
      col: number;
      status: AvailabilityStatus;
    }[]
  >([]);

  const [selection, setSelection] = useState<
    {
      row: number;
      col: number;
      status: AvailabilityStatus;
    }[]
  >([]);

  useEffect(() => {
    const startTime = new Date(props.potentialTimes[0].startTime);
    const startTimeHours = startTime.getHours();
    const startTimeMins = startTime.getMinutes();
    const endTime = new Date(props.potentialTimes[0].endTime);
    const endTimeHours = endTime.getHours();
    const endTimeMins = endTime.getMinutes();
    const hours = endTimeHours - startTimeHours;

    let halfHours = hours * 2;

    if (startTimeMins == 30) {
      halfHours--;
    }
    if (endTimeMins == 30) {
      halfHours--;
    }

    let initialTimeSlots: {
      row: number;
      col: number;
      status: AvailabilityStatus;
    }[] = [];

    const numDays =
      (props.potentialTimes[props.potentialTimes.length - 1].endTime -
        props.potentialTimes[0].startTime) /
      (1000 * 3600 * 24);

    for (let i = 0; i < halfHours; i++) {
      for (let j = 0; j < numDays; j++) {
        const day = new Date(props.potentialTimes[j].startTime);
        let time = startTimeHours + 0.5 * i;
        if (startTimeMins == 30) {
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
        const datetime = new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate(),
          hours,
          mins,
        );
        let currentStatus = AvailabilityStatus.Unavailable;
        for (let index in props.availability) {
          if (
            props.availability[index].status == AvailabilityStatus.Unavailable
          )
            continue;
          const startDT = new Date(props.availability[index].startTime);
          const endDT = new Date(props.availability[index].endTime);
          if (datetime >= startDT && datetime < endDT) {
            currentStatus = props.availability[index].status;
            break;
          }
        }
        initialTimeSlots.push({
          row: i,
          col: j,
          status: currentStatus,
        });
      }
    }

    setTimeSlots(initialTimeSlots);
    setSelection(initialTimeSlots);
  }, [props.potentialTimes, props.availability]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSelecting(true);
    let newTimeSlots: {
      row: number;
      col: number;
      status: AvailabilityStatus;
    }[] = timeSlots.map((object) => ({ ...object }));
    const index = 5 * start[0] + start[1];
    if (newTimeSlots[index].status === props.status) {
      newTimeSlots[index].status = AvailabilityStatus.Unavailable;
    } else if (props.status === AvailabilityStatus.Available) {
      newTimeSlots[index].status = AvailabilityStatus.Available;
    } else {
      newTimeSlots[index].status = AvailabilityStatus.Tentative;
    }
    setSelection(newTimeSlots);
  }, start);

  function updateSelection(end: number[]) {
    const row1 = Math.min(start[0], end[0]);
    const row2 = Math.max(start[0], end[0]);
    const col1 = Math.min(start[1], end[1]);
    const col2 = Math.max(start[1], end[1]);

    let newTimeSlots: {
      row: number;
      col: number;
      status: AvailabilityStatus;
    }[] = timeSlots.map((object) => ({ ...object }));

    for (let i = row1; i <= row2; i++) {
      for (let j = col1; j <= col2; j++) {
        const index = 5 * i + j;
        if (newTimeSlots[index].status === props.status) {
          newTimeSlots[index].status = AvailabilityStatus.Unavailable;
        } else if (props.status === AvailabilityStatus.Available) {
          newTimeSlots[index].status = AvailabilityStatus.Available;
        } else {
          newTimeSlots[index].status = AvailabilityStatus.Tentative;
        }
      }
    }

    setSelection(newTimeSlots);
  }

  // Note: if someone releases the mouse outside the component, need to turn off selection mode.

  function finaliseSelection() {
    setTimeSlots(selection);
    setSelecting(false);
  }

  return (
    <div
      className="timeslotContainer"
      style={{ gridTemplateColumns: 'repeat(5, 60px)' }}
    >
      {timeSlots.map((timeSlot, index) => (
        <div
          className="timeslot"
          key={index}
          style={{
            backgroundColor: (() => {
              if (selection[index].status === AvailabilityStatus.Available) {
                return 'green';
              } else if (
                selection[index].status === AvailabilityStatus.Tentative
              ) {
                return 'yellow';
              } else {
                return 'white';
              }
            })(),
          }}
          onPointerDown={() => setStart([timeSlot.row, timeSlot.col])}
          onPointerEnter={() => {
            if (selecting) {
              updateSelection([timeSlot.row, timeSlot.col]);
            }
          }}
          onPointerUp={() => finaliseSelection()}
        ></div>
      ))}
    </div>
  );
}

export default AvailabilitySelector;
