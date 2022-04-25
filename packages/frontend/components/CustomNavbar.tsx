import { Avatar, Group, Image, Navbar } from '@mantine/core';
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
        <Group direction="column" align="center" mt={50}>
          <Avatar color="teal" radius="lg" size={70}>
            Logo
          </Avatar>
        </Group>
      </Navbar.Section>
      <Navbar.Section grow mt={100}>
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
