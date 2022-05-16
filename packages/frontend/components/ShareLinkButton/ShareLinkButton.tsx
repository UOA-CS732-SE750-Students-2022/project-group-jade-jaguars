import { Group, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import React from 'react';
import { Copy } from 'tabler-icons-react';

interface ShareLinkButtonProp {
  eventLink: string | string[] | undefined;
  text?: string;
}

export const ShareLinkButton = ({ eventLink, text }: ShareLinkButtonProp) => {
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
        className=" text-black border border-1 pl-3 w-fit max-w-[300px] cursor-pointer rounded-md px-2 py-1 text-sm font-base bg-secondarylight border-black hover:bg-secondary "
      >
        <div className="flex flex-row">
          <p className="truncate ...">{text ? text : 'Share Event'}</p>
          <div className="h-5 ml-1 mb-1">
            <Copy />
          </div>
        </div>
      </div>
    </Tooltip>
  );
};
