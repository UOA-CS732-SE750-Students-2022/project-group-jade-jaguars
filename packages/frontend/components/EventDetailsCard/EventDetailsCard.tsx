import { Checkbox, ScrollArea } from '@mantine/core';
import React from 'react';
import DeleteIcon from '../../assets/Delete.svg';
import ShareIcon from '../../assets/Share.svg';
import EditIcon from '../../assets/Edit.svg';
import { formatTimeRange } from '../../helpers/timeFormatter';

interface EventDetailsCardInterface {
  title: string;
  date: Date;
  timeRange: [Date, Date];
  description: string;
  location: string;
  participants?: {
    name: string;
    profilePic?: string;
  }[];
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
}

const EventDetailsCard = (props: EventDetailsCardInterface) => {
  const {
    title,
    date,
    timeRange,
    description,
    location,
    participants,
    onEdit,
    onDelete,
    onShare,
  } = props;

  return (
    <div className="h-4/5 p-10 w-196 bg-white rounded-xl">
      <div id="header" className="flex flex-row justify-between items-center">
        <p className="text-2.5xl font-medium flex-1 truncate ...">{title}</p>
        <div id="tools" className="flex flex-row gap-5">
          <div onClick={onEdit} className="cursor-pointer">
            <EditIcon />
          </div>
          <div onClick={onDelete} className="cursor-pointer">
            <DeleteIcon />
          </div>
          <div onClick={onShare} className="cursor-pointer">
            <ShareIcon />
          </div>
        </div>
      </div>
      <div id="details" className="flex flex-col gap-5 mt-2">
        <div>
          {date.toLocaleDateString()}, {formatTimeRange(timeRange)} NZDT
        </div>
        <div className="h-56 overflow-scroll">{description}</div>
      </div>
      <div id="location"></div>
      <div id="reminder"></div>
      <div id="participants"></div>
    </div>
  );
};

export default EventDetailsCard;
