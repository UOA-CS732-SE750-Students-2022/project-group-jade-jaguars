import { Checkbox, ScrollArea } from '@mantine/core';
import React from 'react';

const CheckBoxList = () => {
  const teamList = [
    '701',
    '750',
    'Board Game Club',
    'Overwatch Club',
    'Board Game Club',
    'Board Game Club',
    'Board Game Club',
    'Board Game Club',
  ];
  const inputBackgroundColorList = [
    '#BDD8FF',
    '#FFE074',
    '#FCDDEC',
    '#FF9F9F',
    '#E2B1FF',
  ];
  return (
    <ScrollArea style={{ height: 100, width: 300 }}>
      {teamList.map((team, index) => {
        const color = 'teal';
        const inputBackgroundColor = inputBackgroundColorList[index % 5];
        const inputStyle = `ml-3 border-solid border-black border-2 cursor-pointer`;
        return (
          <div key={index}>
            <Checkbox
              key={index}
              color={color}
              label={team}
              classNames={{
                root: 'hover:bg-[#99C08B] w-full h-full rounded-md',
                label: 'w-full p-2 ml-3 text-white cursor-pointer',
                input: inputStyle,
                icon: 'ml-[17px] text-black cursor-pointer',
              }}
              styles={{
                input: {
                  backgroundColor: inputBackgroundColor,
                  color: inputBackgroundColor,
                },
              }}
            />
          </div>
        );
      })}
    </ScrollArea>
  );
};

export default CheckBoxList;
