import { Group } from '@mantine/core';
import React, { useState } from 'react';
import { Search } from 'tabler-icons-react';

interface SearchBarProp {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  getValue: (params?: any) => void;
}

export const SearchBar = ({ value, setValue, getValue }: SearchBarProp) => {
  return (
    <div className="w-fit rounded-lg bg-white pr-4 py-1">
      <Group>
        <input
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          type="search"
          placeholder="Search"
          className="h-full w-[300px] border-1 pl-5 py-3 rounded-lg focus:outline-none "
        />
        <button onClick={() => getValue(value)}>
          <Search strokeWidth={1} size={20} />
        </button>
      </Group>
    </div>
  );
};
