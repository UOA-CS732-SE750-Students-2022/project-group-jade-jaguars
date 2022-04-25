import { useState, useEffect, useRef } from 'react';
import {
  AvailabilityBlock,
  AvailabilityStatus,
} from '../types/AvailabilityBlock';
import TimeBracket from '../types/TimeBracket';

/*
 *  Assumption: no more than 7 days sent through as timeOptions.
 *  Props: timeOptions: a list of times that can be selected.
 *         availability: a list of times that the user has previously specified their availability for (can be empty).
 *         status: the current selection status.
 */
function AvailabilitySelector(props: {
  timeOptions: TimeBracket[];
  availability: AvailabilityBlock[];
  status: AvailabilityStatus;
}) {
  const [selecting, setSelecting] = useState<Boolean>(false);
  const [start, setStart] = useState<number[]>([-1, -1]); // The row and column of the click.
  const [newStatus, setNewStatus] = useState<AvailabilityStatus>(
    AvailabilityStatus.Unavailable,
  );

  const [timeList, setTimeList] = useState<TimeBracket[]>([]);
  const [hourList, setHourList] = useState<string[]>([]);

  // The status of the grid upon mouse release.
  const [timeSlots, setTimeSlots] = useState<
    {
      row: number;
      col: number;
      status: AvailabilityStatus;
    }[]
  >([]);

  // The status of the grid when dragging.
  const [selection, setSelection] = useState<
    {
      row: number;
      col: number;
      status: AvailabilityStatus;
    }[]
  >([]);

  const [numCols, setNumCols] = useState<number>(0);

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
      status: AvailabilityStatus;
    }[] = [];

    const numDays = timeList.length;

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
        const datetime = new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate(),
          hours,
          mins,
        );
        let currentStatus = AvailabilityStatus.Unavailable;
        // Check whether user is available at this time.
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
    setSelection(initialTimeSlots);
  }, [props.timeOptions, props.availability]);

  // Change grid on mouse down.
  function startDrag(newStart: number[]) {
    setSelecting(true);
    setStart(newStart);
    let newTimeSlots: {
      row: number;
      col: number;
      status: AvailabilityStatus;
    }[] = timeSlots.map((object) => ({ ...object }));
    const index = numCols * newStart[0] + newStart[1];
    if (newTimeSlots[index].status === props.status) {
      newTimeSlots[index].status = AvailabilityStatus.Unavailable;
    } else if (props.status === AvailabilityStatus.Available) {
      newTimeSlots[index].status = AvailabilityStatus.Available;
    } else {
      newTimeSlots[index].status = AvailabilityStatus.Tentative;
    }
    setSelection(newTimeSlots);
    setNewStatus(newTimeSlots[index].status);
  }

  // Change grid when mouse over div.
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

    // Update all divs between first mouse down and current mouse position.
    for (let i = row1; i <= row2; i++) {
      for (let j = col1; j <= col2; j++) {
        const index = numCols * i + j;
        newTimeSlots[index].status = newStatus;
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
                  if (
                    selection[index].status === AvailabilityStatus.Available
                  ) {
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
              onMouseDown={(e) => {
                e.preventDefault();
                startDrag([timeSlot.row, timeSlot.col]);
              }}
              onMouseEnter={() => {
                if (selecting) {
                  updateSelection([timeSlot.row, timeSlot.col]);
                }
              }}
              onMouseUp={() => finaliseSelection()}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AvailabilitySelector;
