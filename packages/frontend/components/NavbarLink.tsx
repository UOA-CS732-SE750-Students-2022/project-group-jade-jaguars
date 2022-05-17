import React from 'react';
import { Icon as TablerIcon } from 'tabler-icons-react';

interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  active?: boolean;
  onClick?(): void;
}
export const NavbarLink = ({
  icon: Icon,
  active,
  onClick,
}: NavbarLinkProps) => {
  return (
    <div className="cont">
      <div
        onClick={onClick}
        className={`w-full cursor-pointer flex items-center justify-center h-[80px] hover:text-white ${
          active ? 'border-r-8 border-[#99C08B] text-[#99C08B]' : ''
        }`}
      >
        <Icon />
      </div>
      <div className="swipe-in"></div>
    </div>
  );
};
