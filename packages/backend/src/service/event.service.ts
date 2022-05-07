import {
  EventModel,
  IAvailabilityBlock,
  ITimeBracket,
} from 'src/schemas/event.schema';

// Generate a random string identifier for the invite URL
export function identifier(length): string {
  let res = '';
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

// Calculating the finalized time, does this as a readonly function
export async function calculatePotentialTimes(
  eventId: string,
): Promise<ITimeBracket> {
  const eventDoc = await EventModel.findById(eventId);
  if (!eventDoc) {
    throw new Error('Event Not Found');
  }

  // Fetch all the time brackets
  let allTimeBrackets: ITimeBracket[] = [];
  // TODO: Change this to a reduce
  eventDoc.availability.attendeeAvailability.forEach((a) => {
    a.availability.forEach((b) => {
      // For the moment just ignore the status of the availability
      allTimeBrackets.push({
        startDate: b.startDate,
        endDate: b.endDate,
      });
    });
  });

  let commonFreeSlots: ITimeBracket[] = [];
  for (const timeBracket in allTimeBrackets) {
    let timeBracketOk = true;
  }

  const date = new Date();

  return { startDate: date, endDate: date };
}
