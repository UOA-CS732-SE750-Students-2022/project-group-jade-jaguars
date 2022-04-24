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
  onClick?: () => void;
  onHover?: () => void;
}

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
      className="w-218 py-8 px-10 h-56 bg-white flex flex-col gap-1 transition-colors rounded-2xl hover:bg-primary hover:text-white cursor-pointer select-none"
    >
      <div
        id="header"
        className="font-medium flex flex-row justify-between items-center mb-1"
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
