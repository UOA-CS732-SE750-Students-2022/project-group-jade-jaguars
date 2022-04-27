import { ScrollArea } from '@mantine/core';
import React, { useState } from 'react';
import { TimeOptionCheckBox } from './TimeOptionCheckBox';

export const TimeOptionsList = () => {
  const options = [
    'Monday 3rd March,3:00PM - 5:00PM',
    'Monday 4rd March,3:00PM - 5:00PM',
    'Monday 3rd March,3:30PM - 5:00PM',
    'Monday 3rd March,3:00PM - 5:00PM',
    'Monday 3rd March,3:00PM - 5:00PM',
    'Monday 3rd March,3:00PM - 5:00PM',
    'Monday 3rd March,3:00PM - 5:00PM',
    'Monday 3rd March,3:00PM - 5:00PM',
    'Monday 3rd March,3:00PM - 5:00PM',
    'Monday 3rd March,3:00PM - 5:00PM',
    'Monday 3rd March,3:00PM - 5:00PM',
    'Monday 3rd March,3:00PM - 5:00PM',
  ];
  const [active, setActive] = useState(0);
  return (
    <div>
      <ScrollArea style={{ height: 300, width: 400 }}>
        {options.map((option, index) => (
          <TimeOptionCheckBox
            onClick={() => setActive(index)}
            active={index === active}
            key={index}
            option={option}
          ></TimeOptionCheckBox>
        ))}
      </ScrollArea>
    </div>
  );
};
