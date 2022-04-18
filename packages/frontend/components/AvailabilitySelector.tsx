import { useState } from 'react';

function AvailabilitySelector(props: { numRows: number; numCols: number }) {
  const [start, setStart] = useState<number[]>([0, 0]);

  function updateGrid(end: number[]) {
    const row1 = Math.min(start[0], end[0]);
    const row2 = Math.max(start[0], end[0]);
    const col1 = Math.min(start[1], end[1]);
    const col2 = Math.max(start[1], end[1]);

    for (let i = row1; i <= row2; i++) {
      for (let j = col1; j <= col2; j++) {
        const index = 5 * i + j;
        timeslots[index].selected = !timeslots[index].selected;
      }
    }
  }

  const timeslots: {
    row: number;
    col: number;
    selected: boolean;
  }[] = [];

  for (let i = 0; i < props.numRows; i++) {
    for (let j = 0; j < props.numCols; j++) {
      timeslots.push({
        row: i,
        col: j,
        selected: false,
      });
    }
  }

  return (
    <div
      className="timeslotContainer"
      style={{ gridTemplateColumns: 'repeat(5, 60px)' }}
    >
      {timeslots.map((timeslot, index) => (
        <div
          className="timeslot"
          key={index}
          style={timeslot.selected ? { color: 'green' } : { color: 'white' }}
          onPointerDown={() => setStart([timeslot.row, timeslot.col])}
          onPointerUp={() => updateGrid([timeslot.row, timeslot.col])}
        ></div>
      ))}
    </div>
  );
}

export default AvailabilitySelector;
