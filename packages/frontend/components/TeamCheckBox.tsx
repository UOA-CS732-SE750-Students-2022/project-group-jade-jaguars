import { Checkbox } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import React from 'react';
interface TeamCheckBoxProps {
  label: string;
  order: number;
}
export const TeamCheckBox: React.FC<TeamCheckBoxProps> = ({ label, order }) => {
  const inputBackgroundColorList = [
    '#BDD8FF',
    '#FFE074',
    '#FCDDEC',
    '#FF9F9F',
    '#E2B1FF',
  ];
  const color = 'teal';
  const inputBackgroundColor = inputBackgroundColorList[order % 5];
  const inputStyle = `ml-3 border-solid border-black border-2 cursor-pointer`;
  const { hovered, ref } = useHover();
  return (
    <div ref={ref}>
      <Checkbox
        color={color}
        label={label}
        classNames={{
          root: 'hover:bg-[#99C08B] w-full h-full rounded-md',
          label: hovered
            ? 'w-full p-2 ml-3 text-white cursor-pointer'
            : 'w-full p-2 ml-3 text-black cursor-pointer',
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
};
