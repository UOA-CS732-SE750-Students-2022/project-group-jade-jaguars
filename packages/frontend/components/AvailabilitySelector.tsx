import { useState, useEffect, useRef } from 'react';

function AvailabilitySelector(props: { numRows: number; numCols: number }) {
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
    let initialTimeSlots: {
      row: number;
      col: number;
      selected: boolean;
    }[] = [];

    for (let i = 0; i < props.numRows; i++) {
      for (let j = 0; j < props.numCols; j++) {
        initialTimeSlots.push({
          row: i,
          col: j,
          selected: false,
        });
      }
    }

    setTimeSlots(initialTimeSlots);
    setSelection(initialTimeSlots);
  }, [props.numRows, props.numCols]);

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
