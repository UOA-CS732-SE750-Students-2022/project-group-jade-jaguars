import { Group, Checkbox } from '@mantine/core';
import React from 'react';

interface TimeOptionCheckBoxProp {
  option: string;
  active: boolean;
  onClick(): void;
}
export const TimeOptionCheckBox = ({
  option,
  active,
  onClick,
}: TimeOptionCheckBoxProp) => {
  return (
    <div
      onClick={onClick}
      className={`py-5  w-full cursor-pointer rounded-md ${
        active ? ' bg-primary text-white' : 'hover:bg-primarylight'
      }`}
    >
      <Group className="pl-5">
        <Checkbox
          checked={active}
          color={'transparent'}
          classNames={{
            icon: 'text-black',
          }}
          styles={{
            input: {
              cursor: 'pointer',
              backgroundColor: 'white',
              color: 'white',
            },
          }}
        />
        {option}
      </Group>
    </div>
  );
};
