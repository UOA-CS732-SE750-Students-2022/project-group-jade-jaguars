import { Group } from '@mantine/core';
import React, { useState } from 'react';
import { Search } from 'tabler-icons-react';
export const SearchBar = () => {
  const [value, setValue] = useState('');
  return (
    <div className="border-2 w-fit rounded-lg pr-4 py-1">
      <Group>
        <input
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          type="search"
          placeholder="Search"
          className="h-full w-[300px] border-1 pl-4 py-2 focus:outline-none "
        />
        <Search strokeWidth={1} size={20} />
      </Group>
    </div>
  );
};
