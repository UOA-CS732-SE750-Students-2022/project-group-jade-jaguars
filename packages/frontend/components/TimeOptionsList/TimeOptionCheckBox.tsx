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
        <input
          type={'checkbox'}
          checked={active}
          className={`rounded focus:ring-0 ${
            active ? ' text-primary ' : 'border-black'
          }`}
        />

        {option}
      </Group>
    </div>
  );
};
