import React from 'react';
import { Avatar } from '@nextui-org/react';
import Member from '../../types/Member';

interface EventCardInterface {
  title: string;
  date: Date | undefined;
  timeRange: [Date, Date];
  participants: Member[] | undefined;
  description: string | undefined;
  onClick?: (props?: any) => void;
  onHover?: (props?: any) => void;
  size: Sizes;
}

export enum Sizes {
  small = 'sm',
  large = 'lg',
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
    size,
    onClick,
    onHover,
  } = props;

  return (
    <div
      onClick={onClick}
      onMouseOver={onHover}
      className={`flex flex-col ${
        size == Sizes.large
          ? 'h-56 w-218 px-10 py-8 rounded-2xl bg-white'
          : 'px-6 py-4 h-32 rounded-xl w-auto min-w-[100px] bg-cardgrey'
      } justify-center gap-1 transition-colors cursor-pointer select-none hover:bg-primary hover:text-white`}
    >
      <div
        id="header"
        className="flex flex-row items-center justify-between mb-1 font-medium"
      >
        <p
          className={`${
            size == Sizes.large ? 'text-[25px]' : 'text-xl'
          }  flex-1 truncate ... mr-5`}
        >
          {title}
        </p>
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
                size={`${size == Sizes.large ? 'md' : 'sm'}`}
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
      <div
        id="date-time"
        className={`${
          size == Sizes.large ? 'text-lg' : 'text-base'
        } font-normal`}
      >
        <div>
          {date ? (
            <p>
              {date.toLocaleDateString()},{' '}
              {`${timeRange[0].getHours()}:${timeRange[0].getMinutes()}`} -{' '}
              {`${timeRange[1].getHours()}:${timeRange[1].getMinutes()}`} NZDT
            </p>
          ) : (
            <p>Date not available yet</p>
          )}
        </div>
      </div>
      <div
        id="description"
        className={`${size == Sizes.large ? 'mt-3' : ''} text-base`}
      >
        <p className="line-clamp-3">
          {description ? description : 'No description'}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
