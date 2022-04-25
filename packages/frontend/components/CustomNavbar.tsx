import { Avatar, Group, Navbar } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import React, { useState } from 'react';
import { CalendarEvent, LayoutDashboard, Users } from 'tabler-icons-react';
import { NavbarLink } from './NavbarLink';
const linkData = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: CalendarEvent, label: 'Events' },
  { icon: Users, label: 'Teams' },
];
export const CustomNavbar = () => {
  const { height, width } = useViewportSize();
  const [active, setActive] = useState(2);
  return (
    <Navbar height={height} width={{ base: 100 }}>
      <Navbar.Section>
        <Group direction="column" align="center">
          <Avatar src={null} color="teal">
            SC
          </Avatar>
        </Group>
      </Navbar.Section>
      <Navbar.Section>
        <Group direction="column" align="center" spacing="xs">
          {linkData.map((link, index) => {
            return (
              <NavbarLink
                {...link}
                key={link.label}
                active={index === active}
                onClick={() => setActive(index)}
              />
            );
          })}
        </Group>
      </Navbar.Section>
    </Navbar>
  );
};
