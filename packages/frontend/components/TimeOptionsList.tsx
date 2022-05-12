import { ScrollArea } from '@mantine/core';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TimeOptionCheckBox } from './TimeOptionCheckBox';
import { TimeBracket } from '../types/Event';

interface TimeOptionsListProp {
  options: TimeBracket[];
  setCheckedTime: Dispatch<SetStateAction<TimeBracket | undefined>>;
}

export const TimeOptionsList = ({
  options,
  setCheckedTime,
}: TimeOptionsListProp) => {
  const [active, setActive] = useState(0);
  const [stringOptions, setStringOptions] = useState<string[]>([]);
  const handleClick = (index: number) => {
    setCheckedTime(options[index]);
  };

  const getTZDate = (date: Date) => {
    return new Date(
      new Date(date).toISOString().slice(0, 19).replace('Z', ' '),
    );
  };

  useEffect(() => {
    let stringOptions: string[] = [];
    options.forEach((option) => {
      let startDate = getTZDate(option.startDate);
      let endDate = getTZDate(option.endDate);
      stringOptions.push(
        startDate.toDateString() +
          ', ' +
          startDate.getHours() +
          ':' +
          startDate.getMinutes() +
          (startDate.getMinutes() == 0 ? '0 - ' : ' - ') +
          endDate.getHours() +
          ':' +
          endDate.getMinutes() +
          (endDate.getMinutes() == 0 ? '0' : ''),
      );
    });
    setStringOptions(stringOptions);
  }, [options]);

  return (
    <div className="mt-[50px]">
      <ScrollArea style={{ height: 300, width: 400 }}>
        {stringOptions.map((option, index) => (
          <TimeOptionCheckBox
            onClick={() => {
              handleClick(index);
              setActive(index);
            }}
            active={index === active}
            key={index}
            option={option}
          ></TimeOptionCheckBox>
        ))}
      </ScrollArea>
    </div>
  );
};
