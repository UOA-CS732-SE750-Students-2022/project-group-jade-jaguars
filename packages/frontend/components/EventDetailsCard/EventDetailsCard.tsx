import { Select } from '@mantine/core';
import { Avatar } from '@nextui-org/react';
import React from 'react';
import DeleteIcon from '../../assets/Delete.svg';
import ShareIcon from '../../assets/Share.svg';
import EditIcon from '../../assets/Edit.svg';
import { formatTimeRange } from '../../helpers/timeFormatter';
import Member from '../../types/Member';

export interface EventDetailsCardInterface {
  title: string | undefined;
  date: Date | undefined;
  timeRange: [Date | undefined, Date | undefined];
  description?: string;
  location?: string;
  reminder?: string;
  participants: Member[];
  onEdit?: (props?: any) => void;
  onDelete?: (props?: any) => void;
  onShare?: (props?: any) => void;
  onParticipantClick: (props?: any) => void;
  isModal?: boolean;
}

/**
 * This is the component to display all event details,
 * including event title, description, time, date, location, reminder,
 * participant list.
 * @param title The title of the event
 * @param date The date of the event
 * @param timeRange The start and end time of the event
 * @param participants The list of participants with name, profilePic is optional
 * @param onEdit Custom function for editing the event details
 * @param onDelete Custom function for deleting the event
 * @param onShare Custom function for sharing the event details
 * @param onSelectChange Custon function for the select component for reminder
 * @param onParticipantClick Custom function for clicking on participant component
 *
 * @author Raina Song (raina song)
 */

const EventDetailsCard = (props: EventDetailsCardInterface) => {
  const {
    title,
    date,
    timeRange,
    description,
    location,
    reminder,
    participants,
    isModal,
    onEdit,
    onDelete,
    onShare,
    onParticipantClick,
  } = props;

  return (
    <div
      className={
        isModal
          ? 'px-10 pb-10 h-fit w-196'
          : 'p-10 bg-white h-fit w-196 rounded-xl'
      }
    >
      <div id="header" className="flex flex-row items-start justify-between">
        <p
          id="title"
          className="text-[25px] font-medium mr-3 flex-1 h-fit max-h-20 overflow-scroll"
        >
          {title}
        </p>
        <div id="tools" className="flex flex-row gap-5 mt-2">
          {onEdit && (
            <div onClick={onEdit} className="cursor-pointer">
              <EditIcon />
            </div>
          )}
          {onDelete && (
            <div onClick={onDelete} className="cursor-pointer">
              <DeleteIcon />
            </div>
          )}
          {onShare && (
            <div onClick={onShare} className="cursor-pointer">
              <ShareIcon />
            </div>
          )}
        </div>
      </div>
      <div id="details" className="flex flex-col gap-5 mt-2">
        <div>
          {date?.toLocaleDateString()}, {formatTimeRange(timeRange)} NZDT
        </div>
        <div id="description" className="overflow-scroll max-h-44">
          {description ? description : 'No description'}
        </div>
      </div>
      <div id="location" className="mt-5">
        <p className="font-medium text-[18px]">Location</p>
        <p className="max-w-full overflow-scroll max-h-10 text-ellipsis">
          {location ? location : 'No location'}
        </p>
      </div>
      <div id="reminder" className="mt-5">
        <p className="font-medium text-[18px]">Reminder</p>
        <p className="max-w-full w-fit h-fit">{reminder ? reminder : 'None'}</p>
      </div>
      <div id="participants" className="flex flex-col gap-3 mt-5">
        <p className="font-medium text-[18px]">Participants</p>
        <div className="flex flex-col w-56 overflow-scroll rounded-md h-52 ">
          {participants.map((participant, index) => {
            return (
              <div
                key={index}
                onClick={() => onParticipantClick(participant)}
                className="flex flex-row items-center gap-2 px-4 py-2 transition-colors rounded-lg cursor-pointer w-52 hover:bg-primary hover:text-white"
              >
                <Avatar
                  pointer
                  src={participant.profilePic}
                  text={participant.name}
                  bordered
                  borderWeight="light"
                />
                <p>{participant.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsCard;
