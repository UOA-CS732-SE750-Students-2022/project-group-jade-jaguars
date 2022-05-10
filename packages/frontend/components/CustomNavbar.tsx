import { Avatar, Group, Image, Navbar } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import { CalendarEvent, LayoutDashboard, Users } from 'tabler-icons-react';
import { useAuth } from '../src/context/AuthContext';
import { NavbarLink } from './NavbarLink';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Logout } from 'tabler-icons-react';

const linkData = [
  { icon: LayoutDashboard, label: 'Dashboard', address: '/demo' },
  { icon: CalendarEvent, label: 'Events', address: '/create' },
  { icon: Users, label: 'Teams', address: '/demo' },
];
export const CustomNavbar = () => {
  const { height, width } = useViewportSize();
  const [active, setActive] = useState(0);
  const { user, setUser, logout } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    user ? setIsLogin(true) : setIsLogin(false);
    !user && router.push('/');
  }, [user]);

  return isLogin ? (
    <Navbar height={height} width={{ base: 100 }} className="border-1">
      <Navbar.Section>
        <div className="w-[100px]">
          <Group direction="column" align="center" mt={10}>
            <img src="/logo.svg" width={50} />
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
                onClick={() => {
                  router.push(link.address);
                  setActive(index);
                }}
              />
            );
          })}
        </Group>
      </Navbar.Section>
      <Navbar.Section>
        <Group direction="column" align="center" spacing="xs">
          <div
            className="w-3/4 cursor-pointer flex items-center justify-center h-[80px] rounded-md  hover:bg-secondary"
            onClick={logout}
          >
            <Logout />
          </div>
        </Group>
      </Navbar.Section>
    </Navbar>
  ) : (
    <div></div>
  );
};
