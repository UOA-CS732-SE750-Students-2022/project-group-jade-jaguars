import {
  EventModel,
  IAvailabilityBlock,
  IEventAvailability,
  ITimeBracket,
} from '../schemas/event.schema';

// Generate a random string identifier for the invite URL
export function identifier(length): string {
  let res = '';
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

// A bad version of the overlaps problem
// Calculating the finalized time, does this as a readonly function
export function calculatePotentialTimes(
  eventAvailability: IEventAvailability,
): ITimeBracket[] {
  console.log('Hit calculate potential times');

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
