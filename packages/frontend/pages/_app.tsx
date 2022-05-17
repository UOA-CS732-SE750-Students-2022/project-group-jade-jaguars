import { AppProps } from 'next/app';
import Head from 'next/head';
import { AppShell, MantineProvider } from '@mantine/core';
import '../styles/globals.css';
import 'antd/dist/antd.css';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { CustomNavbar } from '../components/CustomNavbar';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <div className="bg-backgroundgrey m-0">
      <Head>
        <title>Count Me In</title>
        <link rel="icon" type="image/x-icon" href="/logo.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'light',
          fontFamily: 'Poppins, sans-serif',
          colors: {
            transparent: ['#00FFFFFF'],
          },
        }}
      >
        <AuthProvider>
          <AppShell
            styles={{ main: { padding: '0' } }}
            fixed
            navbar={<CustomNavbar />}
          >
            <Component {...pageProps} />
          </AppShell>
        </AuthProvider>
      </MantineProvider>
    </div>
  );
}
