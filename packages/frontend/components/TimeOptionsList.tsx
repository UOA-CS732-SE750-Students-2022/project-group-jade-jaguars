import { ScrollArea } from '@mantine/core';
import React, { useState } from 'react';
import { TimeOptionCheckBox } from './TimeOptionCheckBox';

interface TimeOptionsListProp {
  options: string[];
}

export const TimeOptionsList = ({ options }: TimeOptionsListProp) => {
  const [active, setActive] = useState(0);
  const [checkedTime, setCheckedTime] = useState('');
  const handleClick = (option: string) => {
    setCheckedTime(option);
  };
  return (
    <div>
      <ScrollArea style={{ height: 300, width: 400 }}>
        {options.map((option, index) => (
          <TimeOptionCheckBox
            onClick={() => {
              handleClick(option);
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
