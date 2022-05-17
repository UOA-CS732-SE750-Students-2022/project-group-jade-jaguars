import { Affix, Group, Navbar } from '@mantine/core';
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
import { useRouter } from 'next/router';
import { Logout, Plus } from 'tabler-icons-react';

const linkData = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    address: '/dashboard',
    active: true,
  },
  { icon: CalendarEvent, label: 'Events', address: '/event', active: false },
  { icon: Users, label: 'Teams', address: '/team', active: false },
  { icon: ArrowsJoin, label: 'Join', address: '/join', active: false },
];
export const CustomNavbar = () => {
  const { height } = useViewportSize();
  const [active, setActive] = useState(0);
  const { user, logout, setAuthToken, authToken } = useAuth();

  const router = useRouter();
  const [currentRoute, setCurrentRoute] = useState(router.pathname);

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    linkData.map((data, index) => {
      if (data.address === currentRoute) {
        setActive(index);
      }
    });
  }, []);

  useEffect(() => {
    authToken ? setIsLogin(true) : setIsLogin(false);
  }, [authToken]);

  return isLogin ? (
    <Navbar height={height} width={{ base: 100 }} className="border-1">
      <Navbar.Section>
        <div className="w-[100px] mt-10">
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
            onClick={() => {
              logout;
              setAuthToken('');
              router.push('/login');
            }}
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
