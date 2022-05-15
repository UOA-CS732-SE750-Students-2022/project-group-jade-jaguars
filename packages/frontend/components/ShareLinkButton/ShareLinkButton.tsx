import { Group, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Copy } from 'tabler-icons-react';

interface ShareLinkButtonProp {
  eventLink: string;
}

export const ShareLinkButton = ({ eventLink }: ShareLinkButtonProp) => {
  const clipboard = useClipboard();
  const router = useRouter();
  const [ogUrl, setOgUrl] = useState('');

  useEffect(() => {
    const host = window.location.href;
    const baseUrl = `${host}`;

    setOgUrl(`${baseUrl}`);
  }, [router.pathname]);
  return (
    <Tooltip
      label="Event Link Copied"
      transition="slide-down"
      opened={clipboard.copied}
    >
      <div
        onClick={() => {
          clipboard.copy(ogUrl);
        }}
        className="text-black border-2 w-fit cursor-pointer rounded-md px-2 py-1 font-semibold bg-secondarylight border-black hover:bg-secondary "
      >
        <Group>
          Share Event
          <Copy />
        </Group>
      </div>
    </Tooltip>
  );
};
