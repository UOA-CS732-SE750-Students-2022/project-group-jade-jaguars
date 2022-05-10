import { IEventAvailability, ITimeBracket } from '../schemas/event.schema';

// A bad version of the overlaps problem
// Calculating the finalized time, does this as a readonly function
export function calculatePotentialTimes(
  eventAvailability: IEventAvailability,
): ITimeBracket[] {
  // Count the number of overlaps for the time bracket
  let solution: { bracket: ITimeBracket; overlaps: number }[] = [];
  let allTimeBrackets: ITimeBracket[] = [];
  eventAvailability.attendeeAvailability.forEach((a) => {
    a.availability.forEach((b) => {
      allTimeBrackets.push({ startDate: b.startDate, endDate: b.endDate });
    });
  });

  // O(n^2): Check for maximal overlaps
  for (const candidate of allTimeBrackets) {
    let overlaps = 0;
    for (const b of allTimeBrackets) {
      if (bracketsOverlap(candidate, b)) {
        overlaps++;
      }
    }
    solution.push({ bracket: candidate, overlaps });
  }

  // Sort by decending overlaps amounts, (ie: highest overlap is at head)
  solution.sort((b1, b2) => {
    if (b1.overlaps < b2.overlaps) {
      return -1;
    } else if (b1.overlaps > b2.overlaps) {
      return 1;
    } else {
      return 0;
    }
  });

  // Remove all duplicate times
  solution = [...new Set(solution.map((s) => JSON.stringify(s)))].map((s) =>
    JSON.parse(s),
  );

  // Limit to 5 entities, slice works fine on arrays smaller than this criteria
  solution.slice(0, 4);

  return solution.map((x) => x.bracket);
}

// Do the two dates overlap at all (even partially?)
export function bracketsOverlap(d1: ITimeBracket, d2: ITimeBracket): boolean {
  if (d1.startDate >= d2.startDate && d1.endDate <= d2.endDate) {
    return true;
  }
  // Existing bracket starting left side
  else if (d1.startDate >= d2.startDate && d1.endDate >= d2.endDate) {
    return true;
  }
  // Existing bracket ending right side
  else if (d1.startDate <= d2.startDate && d1.endDate <= d2.endDate) {
    return true;
  }
  // Middle
  else if (d1.startDate <= d2.startDate && d1.endDate >= d2.endDate) {
  }
  // Date not in bracket
  else {
    return false;
  }
}

// Split time bracket spanning over multiple days into multiple into multiple timebrackets contained within individual days
export function splitDays(
  formStartDate: Date,
  formEndDate: Date,
): ITimeBracket[] {
  // timeList will contain the list of potential times split up among different days.
  let timeList: ITimeBracket[] = [];

  const daysInTB =
    (formEndDate.getTime() - formStartDate.getTime()) / (1000 * 3600 * 24); // How many days to split into.

  const startDate = new Date(formStartDate);

  // Separate out each day.
  for (let i = 0; i < daysInTB; i++) {
    let myEndTime = new Date(formEndDate);
    if (
      startDate.getHours() == 0 &&
      myEndTime.getHours() == 0 &&
      startDate.getMinutes() == 0 &&
      myEndTime.getMinutes() == 0
    ) {
      myEndTime.setDate(startDate.getDate() + 1);
    } else {
      if (formEndDate.getHours() < 12 && formStartDate.getHours() >= 12) {
        myEndTime.setDate(startDate.getDate() + 1);
      } else {
        console.log('hit here');
        myEndTime.setDate(startDate.getDate());
      }
    }
    let newStartTime = new Date(startDate);
    let newEndTime = new Date(myEndTime);
    timeList.push({
      startDate: newStartTime,
      endDate: newEndTime,
    });
    startDate.setDate(startDate.getDate() + 1);
  }
  return timeList;
}
