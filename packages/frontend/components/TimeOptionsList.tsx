import { ScrollArea } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { TimeOptionCheckBox } from './TimeOptionCheckBox';
import { TimeBracket } from '../types/Event';

interface TimeOptionsListProp {
  options: TimeBracket[];
}

export const TimeOptionsList = ({ options }: TimeOptionsListProp) => {
  const [active, setActive] = useState(0);
  const [checkedTime, setCheckedTime] = useState<TimeBracket>();
  const [stringOptions, setStringOptions] = useState<string[]>([]);
  const handleClick = (index: number) => {
    setCheckedTime(options[index]);
  };

  useEffect(() => {
    console.log(options);
    let stringOptions: string[] = [];
    options.forEach((option) => {
      let startDate = new Date(option.startDate);
      startDate.setHours(startDate.getHours() + 12);
      let endDate = new Date(option.endDate);
      endDate.setHours(endDate.getHours() + 12);
      stringOptions.push(
        startDate.toDateString() +
          ', ' +
          startDate.getHours() +
          ':' +
          startDate.getMinutes() +
          (startDate.getMinutes() == 0 ? '0 - ' : ' - ') +
          endDate.toDateString() +
          ', ' +
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
