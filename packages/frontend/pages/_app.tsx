import { AppProps } from 'next/app';
import Head from 'next/head';
import { AppShell, MantineProvider } from '@mantine/core';
import '../styles/globals.css';
import 'antd/dist/antd.css';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { CustomNavbar } from '../components/CustomNavbar';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const { user, setUser } = useAuth();

  return (
    <>
      <Head>
        <title>Count Me In</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        <AuthProvider>
          <AppShell fixed navbar={<CustomNavbar />}>
            <Component {...pageProps} />
          </AppShell>
        </AuthProvider>
      </MantineProvider>
    </>
  );
}
