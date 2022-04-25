import { createStyles, Tooltip, UnstyledButton } from '@mantine/core';
import React from 'react';
import { Icon as TablerIcon } from 'tabler-icons-react';

const useStyles = createStyles((theme) => ({
  link: {
    width: '100%',
    height: 80,
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.black,
    opacity: 1,

    '&:hover': {
      opacity: 1,
      backgroundColor: '#99C08B',
      color: theme.white,
    },
  },

  active: {
    color: '#99C08B',
    borderRight: 'solid',
    borderWidth: '8px',
    opacity: 1,
    '&:hover': {
      borderColor: '#99C08B',
      backgroundColor: '#99C08B',
    },
  },
}));

interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  active?: boolean;
  onClick?(): void;
}
export const NavbarLink = ({
  icon: Icon,
  label,
  active,
  onClick,
}: NavbarLinkProps) => {
  const { classes, cx } = useStyles();
  return (
    <UnstyledButton
      onClick={onClick}
      className={cx(classes.link, { [classes.active]: active })}
    >
      <Icon />
    </UnstyledButton>
  );
};
