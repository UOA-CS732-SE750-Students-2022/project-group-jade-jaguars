import { Avatar, Group, Navbar } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import React from 'react';

export const CustomNavbar = () => {
  const { height, width } = useViewportSize();

  return (
    <Navbar height={height} p="xs" width={{ base: 100 }}>
      <Navbar.Section>
        <Group>
          <Avatar src={null} color="teal">
            SC
          </Avatar>
        </Group>
      </Navbar.Section>
      {/* Layoutdashboard
       CalendarEvent
       Users*/}
      <Navbar.Section>icons</Navbar.Section>
    </Navbar>
  );
};
