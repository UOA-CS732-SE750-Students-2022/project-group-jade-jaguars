import { useState, useEffect, useRef } from 'react';
import TimeBracket from '../types/TimeBracket';

function AvailabilitySelector(props: {
  potentialTimes: TimeBracket[];
  availability: TimeBracket[];
}) {
  const firstRender = useRef(true);
  const [selecting, setSelecting] = useState<Boolean>(false);
  const [start, setStart] = useState<number[]>([-1, -1]);
  const [timeSlots, setTimeSlots] = useState<
    {
      row: number;
      col: number;
      selected: boolean;
    }[]
  >([]);

  const [selection, setSelection] = useState<
    {
      row: number;
      col: number;
      selected: boolean;
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
      selected: boolean;
    }[] = [];

    for (let i = 0; i < halfHours; i++) {
      for (let j = 0; j < props.potentialTimes.length; j++) {
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
        let isSelected = false;
        for (let index in props.availability) {
          const startDT = new Date(props.availability[index].startTime);
          const endDT = new Date(props.availability[index].endTime);
          if (datetime >= startDT && datetime < endDT) {
            isSelected = true;
            break;
          }
        }
        initialTimeSlots.push({
          row: i,
          col: j,
          selected: isSelected,
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
      selected: boolean;
    }[] = timeSlots.map((object) => ({ ...object }));
    const index = 5 * start[0] + start[1];
    newTimeSlots[index].selected = !newTimeSlots[index].selected;
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
      selected: boolean;
    }[] = timeSlots.map((object) => ({ ...object }));

    for (let i = row1; i <= row2; i++) {
      for (let j = col1; j <= col2; j++) {
        const index = 5 * i + j;
        newTimeSlots[index].selected = !timeSlots[index].selected;
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
          style={
            selection[index].selected
              ? { backgroundColor: 'green' }
              : { backgroundColor: 'white' }
          }
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
