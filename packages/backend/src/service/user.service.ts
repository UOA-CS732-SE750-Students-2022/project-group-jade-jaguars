import { EventModel } from '../schemas/event.schema';
import { UserModel } from '../schemas/user.schema';

// Adds an event to the user, if the event already exists for the user then skip, user.events thus forms a set
// If the return is defined then there has been an error
export async function addToUserEventSet(userId: string, eventId: string) {
  // Check if the user exists
  const userDoc = await UserModel.findOne({ _id: userId });
  if (!userDoc) {
    throw new Error('User Not Found');
  }

  // Check if the event exists
  const eventDoc = await EventModel.findOne({ _id: eventId });
  if (!eventDoc) {
    throw new Error('Event Not Found');
  }

  // Add event to the users event set
  if (!userDoc.events.includes(eventId)) {
    userDoc.events.push(eventId);
  }
  await userDoc.save();
}
