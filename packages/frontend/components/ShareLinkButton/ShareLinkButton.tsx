import { Group, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import React from 'react';
import { Copy } from 'tabler-icons-react';

interface ShareLinkButtonProp {
  eventLink: string | string[] | undefined;
}

export const ShareLinkButton = ({ eventLink }: ShareLinkButtonProp) => {
  const clipboard = useClipboard();
  return (
    <Tooltip
      label="Event Link Copied"
      transition="slide-down"
      opened={clipboard.copied}
    >
      <div
        onClick={() => {
          clipboard.copy(eventLink);
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
