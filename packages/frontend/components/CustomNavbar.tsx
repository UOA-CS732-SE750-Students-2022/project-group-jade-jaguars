import { Affix, Avatar, Button, Group, Image, Navbar } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import {
  CalendarEvent,
  LayoutDashboard,
  Users,
  ArrowsJoin,
} from 'tabler-icons-react';
import { useAuth } from '../src/context/AuthContext';
import { NavbarLink } from './NavbarLink';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Logout, Plus } from 'tabler-icons-react';

const linkData = [
  { icon: LayoutDashboard, label: 'Dashboard', address: '/dashboard' },
  { icon: CalendarEvent, label: 'Events', address: '/event' },
  { icon: Users, label: 'Teams', address: '/team' },
  { icon: ArrowsJoin, label: 'Join', address: '/join' },
];
export const CustomNavbar = () => {
  const { height, width } = useViewportSize();
  const [active, setActive] = useState(0);
  const { user, setUser, logout } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    user ? setIsLogin(true) : setIsLogin(false);
    !user && router.push('/login');
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
        <Group direction="column" align="center" spacing="xs" mb={40}>
          <div
            className="w-[70px] cursor-pointer flex items-center justify-center h-[70px] rounded-xl  hover:bg-secondary"
            onClick={logout}
          >
            <Logout />
          </div>
        </Group>
      </Navbar.Section>
      {!router.pathname.includes('/create') && (
        <Affix position={{ bottom: 40, right: 40 }}>
          <Group direction="column" align="center" spacing="xs">
            <div
              className="rounded-xl p-4 hover:bg-secondarylight cursor-pointer bg-secondary "
              onClick={() => router.push('/create')}
            >
              <Plus strokeWidth={2} size={35} />
            </div>
          </Group>
        </Affix>
      )}
    </Navbar>
  ) : (
    <div></div>
  );
};
