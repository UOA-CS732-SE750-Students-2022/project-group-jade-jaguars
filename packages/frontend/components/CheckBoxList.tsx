import { ScrollArea } from '@mantine/core';
import React, { useState } from 'react';
import { TeamCheckBox } from './TeamCheckBox';

const CheckBoxList = () => {
  const [checkedTeamList, setCheckedTeamList] = useState<string[]>([]);
  const teamList = [
    '701',
    '750',
    'Board Game Club',
    'Overwatch Club',
    'Board Game Club',
    'Board Game Club',
    'Board Game Club',
    'Board Game Club',
  ];
  const handleClick = (checked: boolean, label: string, teamId: string) => {
    let temp;
    if (checked) {
      temp = [...checkedTeamList];
      temp = temp.filter((name) => name != label);
    } else {
      temp = [...checkedTeamList, label];
    }
    setCheckedTeamList(temp);
  };

  return (
    <ScrollArea style={{ height: 100, width: 300 }}>
      {teamList.map((team, index) => {
        return (
          <TeamCheckBox
            label={team}
            order={index}
            key={index}
            handleClick={handleClick}
            teamId={''}
          />
        );
      })}
    </ScrollArea>
  );
};

export default CheckBoxList;
