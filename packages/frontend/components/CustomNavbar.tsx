import { Avatar, Group, Image, Navbar } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import { CalendarEvent, LayoutDashboard, Users } from 'tabler-icons-react';
import { useAuth } from '../src/context/AuthContext';
import { NavbarLink } from './NavbarLink';
import { getAuth } from 'firebase/auth';

const linkData = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: CalendarEvent, label: 'Events' },
  { icon: Users, label: 'Teams' },
];
export const CustomNavbar = () => {
  const { height, width } = useViewportSize();
  const [active, setActive] = useState(2);
  const { user, setUser } = useAuth();

  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    user ? setIsLogin(true) : setIsLogin(false);
  }, [user]);

  useEffect(() => {
    const clearListener = getAuth().onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => {
      clearListener();
    };
  }, [setUser]);
  return isLogin ? (
    <Navbar height={height} width={{ base: 100 }} className="border-1">
      <Navbar.Section>
        <div className="w-[100px]">
          <Group direction="column" align="center" mt={50}>
            <Avatar color="teal" radius="lg" size={70}>
              Logo
            </Avatar>
          </Group>
        </div>
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
  ) : (
    <div></div>
  );
};
