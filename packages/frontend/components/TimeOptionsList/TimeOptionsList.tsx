import { ScrollArea } from '@mantine/core';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TimeOptionCheckBox } from './TimeOptionCheckBox';
import { TimeBracket } from '../../types/Event';
import { formatTimeBracket, getTZDate } from '../../helpers/timeFormatter';

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

  useEffect(() => {
    let stringOptions: string[] = [];
    options.forEach((option) => {
      let startDate = getTZDate(option.startDate);
      let endDate = getTZDate(option.endDate);
      stringOptions.push(formatTimeBracket(startDate, endDate));
    });
    setStringOptions(stringOptions);
    handleClick(0);
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
