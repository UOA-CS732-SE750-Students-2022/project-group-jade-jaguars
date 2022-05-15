import TeamDetails from '../types/TeamDetails';
import Member from '../types/Member';
import { Card, Text, Grid, Avatar } from '@nextui-org/react';
import { useEffect, useState } from 'react';

function TeamCard(team: TeamDetails) {
  const { members, onClick } = team;

  return (
    <div
      onClick={onClick}
      className="flex flex-col h-[270px] gap-1 px-10 py-12 transition-colors bg-white cursor-pointer select-none w-[400px] rounded-2xl hover:bg-primary hover:text-white"
    >
      <p className="text-[25px] font-medium truncate ... mr-5">{team.title}</p>
      <div id="description" className="mt-3 text-base">
        <p className="line-clamp-1">{team.description}</p>
      </div>
      <div className="mt-8 ml-2">
        {members && members.length > 0 && (
          <Avatar.Group
            count={members.length - 12 > 0 ? members.length - 12 : undefined}
            animated={false}
          >
            {members.slice(0, 4).map((participant, index) => (
              <Avatar
                key={index}
                size="lg"
                pointer
                text={participant.name}
                src={participant.profilePic}
                stacked
                bordered
                borderWeight={'light'}
              />
            ))}
          </Avatar.Group>
        )}
      </div>
    </div>
  );
}

export default TeamCard;
