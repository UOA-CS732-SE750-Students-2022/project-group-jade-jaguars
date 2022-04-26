import React from 'react';
import { Avatar } from '@nextui-org/react';

interface EventCardInterface {
  title: string;
  date: Date;
  timeRange: [Date, Date];
  participants: {
    name: string;
    profilePic?: string;
  }[];
  description: string;
  onClick?: (props?: any) => void;
  onHover?: (props?: any) => void;
}

/**
 * This is the card component that displays information of an event,
 * including event title, date, time, description and participants
 * @param title Title of the event
 * @param date Date of the event
 * @param timeRange Start and end time for the event (currently only support NZDT)
 * @param participants A list of participants with name, profile picture is optional
 * @param description Description of the event
 * @param onClick Custom onClick event when clicking on the card, optional
 * @param onHover Custom onHover event when hovering (mouse over) on the card, optional
 *
 * @author Raina Song (rainasong)
 */

const EventCard = (props: EventCardInterface) => {
  const {
    title,
    date,
    timeRange,
    participants,
    description,
    onClick,
    onHover,
  } = props;

  return (
    <div
      onClick={onClick}
      onMouseOver={onHover}
      className="flex flex-col h-56 gap-1 px-10 py-8 transition-colors bg-white cursor-pointer select-none w-218 rounded-2xl hover:bg-primary hover:text-white"
    >
      <div
        id="header"
        className="flex flex-row items-center justify-between mb-1 font-medium"
      >
        <h1 className="text-2.5xl flex-1 truncate ... mr-5">{title}</h1>
        <div>
          <Avatar.Group
            count={
              participants.length - 4 > 0 ? participants.length - 4 : undefined
            }
            animated={false}
          >
            {participants.slice(0, 4).map((participant, index) => (
              <Avatar
                key={index}
                size="md"
                pointer
                text={participant.name}
                src={participant.profilePic}
                stacked
                bordered
                borderWeight={'light'}
              />
            ))}
          </Avatar.Group>
        </div>
      </div>
      <div id="date-time" className="text-lg font-normal">
        <p>
          {date.toLocaleDateString()},{' '}
          {`${timeRange[0].getHours()}:${timeRange[0].getMinutes()}`} -{' '}
          {`${timeRange[1].getHours()}:${timeRange[1].getMinutes()}`} NZDT
        </p>
      </div>
      <div id="description" className="mt-3 text-base">
        <p className="line-clamp-3">{description}</p>
      </div>
    </div>
  );
};

export default EventCard;
