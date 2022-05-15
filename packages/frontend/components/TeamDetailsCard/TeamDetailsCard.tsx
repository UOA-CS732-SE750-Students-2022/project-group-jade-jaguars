import TeamDetails from '../../types/TeamDetails';
import { Card, Text, Row } from '@nextui-org/react';
import MemberCard from '../MemberCard';
import { UserPlus, Edit, Trash } from 'tabler-icons-react';
import { ActionIcon } from '@mantine/core';
import styles from './TeamDetailsCard.module.css';
import { MouseEventHandler } from 'react';
import Team from '../types/Team';
import DeleteIcon from '../assets/Delete.svg';
import EditIcon from '../assets/Edit.svg';

function TeamDetailsCard(props: {
  team: Team;
  editTeam: (param?: any) => void;
  deleteTeam: (param?: any) => void;
  addUser: MouseEventHandler<SVGElement>;
  deleteUser: (param?: any) => void;
}) {
  const { editTeam, deleteTeam, addUser, deleteUser, team } = props;
  return (
    <div className="p-10 bg-white w-[350px] h-[80vh] rounded-xl">
      <div id="header" className="flex flex-row items-start justify-between">
        <p
          id="title"
          className="text-[25px] font-medium mr-3 flex-1 h-fit max-h-20 overflow-scroll"
        >
          {team.title}
        </p>
        <div id="tools" className="flex flex-row gap-5 mt-2">
          <div onClick={editTeam} className="cursor-pointer">
            <EditIcon />
          </div>
          <div onClick={deleteTeam} className="cursor-pointer">
            <DeleteIcon />
          </div>
        </div>
      </div>
      <div id="details" className="flex flex-col gap-5 mt-2">
        <div id="description" className="overflow-scroll max-h-44">
          {team.description ? team.description : 'No description'}
        </div>
      </div>
      <Row wrap="wrap" justify="space-between">
        <Text
          className="pt-[20px] mr-[0px] max-w-fit"
          css={{ marginLeft: '5px' }}
        >
          Members
        </Text>
        <ActionIcon className="absolute bottom-0 right-0 mr-[10px]">
          <UserPlus onClick={props.addUser} />
        </ActionIcon>
      </Row>
      <div className="overflow-y-scroll flex flex-col gap-2 p-[5px] mt-2 h-[80%]">
        {props.team.membersList &&
          props.team.membersList.map((member, index) => (
            <MemberCard key={index} member={member} deleteUser={deleteUser} />
          ))}
      </div>
    </div>
  );
}

export default TeamDetailsCard;
