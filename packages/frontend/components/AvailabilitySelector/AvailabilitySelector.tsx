import { useState, useEffect } from 'react';
import {
  AvailabilityBlock,
  AvailabilityStatusStrings,
} from '../../types/Availability';
import { TimeBracket } from '../../types/Event';

/*
 *  Assumption: no more than 7 days sent through as timeOptions.
 *  Props: timeOptions: a list of times that can be selected.
 *         availability: a list of times that the user has previously specified their availability for (can be empty).
 *         status: the current selection status.
 */
function AvailabilitySelector(props: {
  timeOptions: TimeBracket;
  availability: AvailabilityBlock[];
  status: AvailabilityStatusStrings;
  pageNum: number;
  selectionHandler: (selection: {
    startDate: Date;
    endDate: Date;
  }) => Promise<Boolean>;
  deletionHandler: (deletion: {
    startDate: Date;
    endDate: Date;
  }) => Promise<Boolean>;
}) {
  const [selecting, setSelecting] = useState<Boolean>(false);
  const [start, setStart] = useState<number[]>([-1, -1]); // The row and column of the click.
  const [time1, setTime1] = useState<number[]>([-1, -1]); // The row and column of the top left corner.
  const [time2, setTime2] = useState<number[]>([-1, -1]); // The row and column of the bottom right corner.
  const [newStatus, setNewStatus] = useState<AvailabilityStatusStrings>(
    AvailabilityStatusStrings.Unavailable,
  );

  const [timeList, setTimeList] = useState<TimeBracket[]>([]);
  const [hourList, setHourList] = useState<string[]>([]);

  // The status of the grid upon mouse release.
  const [timeSlots, setTimeSlots] = useState<
    {
      row: number;
      col: number;
      status: AvailabilityStatusStrings;
    }[]
  >([]);

  // The status of the grid when dragging.
  const [selection, setSelection] = useState<
    {
      row: number;
      col: number;
      status: AvailabilityStatusStrings;
    }[]
  >([]);

  const [numCols, setNumCols] = useState<number>(0);

  // Initialise the grid.
  useEffect(() => {
    const startTime = new Date(props.timeOptions.startDate);
    // Set the start time to the correct dates using page number to specify the number of weeks.
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
      status: AvailabilityStatusStrings;
    }[] = [];

    const numDays = timeList.length;

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
        let currentStatus = AvailabilityStatusStrings.Unavailable;
        // Check whether user is available at this time.
        for (let index in props.availability) {
          if (
            props.availability[index].status ==
            AvailabilityStatusStrings.Unavailable
          )
            continue;
          const startDT = new Date(
            new Date(props.availability[index].startDate)
              .toISOString()
              .slice(0, 19)
              .replace('Z', ' '),
          );
          const endDT = new Date(
            new Date(props.availability[index].endDate)
              .toISOString()
              .slice(0, 19)
              .replace('Z', ' '),
          );
          if (dateTime >= startDT && dateTime < endDT) {
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
    setSelection(initialTimeSlots);
  }, [props.timeOptions, props.availability, props.pageNum]);

  // Change grid on mouse down.
  function startDrag(newStart: number[]) {
    setSelecting(true);
    setStart(newStart);
    let newTimeSlots: {
      row: number;
      col: number;
      status: AvailabilityStatusStrings;
    }[] = timeSlots.map((object) => ({ ...object }));
    const index = numCols * newStart[0] + newStart[1];
    if (newTimeSlots[index].status === props.status) {
      newTimeSlots[index].status = AvailabilityStatusStrings.Unavailable;
    } else if (props.status === AvailabilityStatusStrings.Available) {
      newTimeSlots[index].status = AvailabilityStatusStrings.Available;
    } else {
      newTimeSlots[index].status = AvailabilityStatusStrings.Tentative;
    }
    setSelection(newTimeSlots);
    setTime1([newStart[0], newStart[1]]);
    setTime2([newStart[0], newStart[1]]);
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
      status: AvailabilityStatusStrings;
    }[] = timeSlots.map((object) => ({ ...object }));

    // Update all divs between first mouse down and current mouse position.
    for (let i = row1; i <= row2; i++) {
      for (let j = col1; j <= col2; j++) {
        const index = numCols * i + j;
        newTimeSlots[index].status = newStatus;
      }
    }

    setSelection(newTimeSlots);
    setTime1([row1, col1]);
    setTime2([row2, col2]);
  }

  // Note: if someone releases the mouse outside the component, need to turn off selection mode.

  async function finaliseSelection() {
    setTimeSlots(selection);
    setSelecting(false);
    const startTime = new Date(timeList[0].startDate);
    let startHours = startTime.getHours() + 0.5 * time1[0];
    let endHours = startTime.getHours() + 0.5 * time2[0];

    // Add half an hour to startTime if mins is 30.
    if (startTime.getMinutes() === 30) {
      startHours += 0.5;
      endHours += 0.5;
    }

    // Check if start time is on hour or half hour.
    let startMins = 0;
    if (startHours % 1) {
      startMins = 30;
      startHours -= 0.5;
    }

    // Check if end time is on hour or half hour.
    let endMins = 0;
    if (endHours % 1) {
      endMins = 30;
      endHours -= 0.5;
    }

    let startDate = new Date(startTime);
    startDate.setDate(startTime.getDate() + time1[1]);
    startDate.setHours(startHours);
    startDate.setMinutes(startMins);

    let endDate = new Date(startTime);
    endDate.setDate(startTime.getDate() + time2[1]);
    endDate.setHours(endHours);
    endDate.setMinutes(endMins);

    props
      .deletionHandler({
        startDate,
        endDate,
      })
      .then(() => {
        if (newStatus !== AvailabilityStatusStrings.Unavailable) {
          props.selectionHandler({
            startDate,
            endDate,
          });
        }
      });
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
                  if (
                    selection[index].status ===
                    AvailabilityStatusStrings.Available
                  ) {
                    return 'bg-primary';
                  } else if (
                    selection[index].status ===
                    AvailabilityStatusStrings.Tentative
                  ) {
                    return 'bg-secondary';
                  } else {
                    return 'bg-white';
                  }
                })()
              }
              key={index}
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
