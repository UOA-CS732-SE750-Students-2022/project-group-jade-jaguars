import React from 'react';
import { Avatar } from '@nextui-org/react';

interface CustomButtonInterface {
  text: string;
  onClick: (param?: any) => void;
}

const CustomButton = (props: CustomButtonInterface) => {
  const { text, onClick } = props;

  return (
    <div>
      <button
        className="px-3 py-1 rounded-lg text-sm bg-secondary text-black hover:bg-primary hover:text-white"
        onClick={onClick}
      >
        <span>{text}</span>
      </button>
    </div>
  );
};

export default CustomButton;
