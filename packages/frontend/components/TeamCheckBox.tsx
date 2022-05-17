import { Checkbox } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import React from 'react';
interface TeamCheckBoxProps {
  label: string;
  order: number;
  handleClick: (
    checked: boolean,
    label: string,
    teamId: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  teamId: string;
  checked?: boolean;
  initialChecked?: boolean;
  setChecked?: React.Dispatch<React.SetStateAction<string>>;
}
export const TeamCheckBox: React.FC<TeamCheckBoxProps> = ({
  label,
  order,
  handleClick,
  teamId,
  checked,
  initialChecked,
}) => {
  const inputBackgroundColorList = [
    '#BDD8FF',
    '#FFE074',
    '#FCDDEC',
    '#FF9F9F',
    '#E2B1FF',
  ];
  const color = 'transparent';
  const inputBackgroundColor = inputBackgroundColorList[order % 5];
  const inputStyle = `ml-3 border-solid border-black border-2 rounded-md cursor-pointer`;
  const { hovered, ref } = useHover();
  return (
    <div ref={ref}>
      <Checkbox
        checked={initialChecked ? initialChecked : checked}
        onChange={(e) => {
          handleClick(e.currentTarget.checked, label, teamId, e);
        }}
        color={color}
        label={label}
        classNames={{
          root: 'hover:bg-primary bg-cardgrey w-full h-full py-1 px-1 rounded-lg',
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
