import TeamDetails from '../../types/TeamDetails';
import { Card, Text, Row } from '@nextui-org/react';
import MemberCard from '../MemberCard';
import { UserPlus, Edit, Trash } from 'tabler-icons-react';
import { ActionIcon } from '@mantine/core';
import styles from './TeamDetailsCard.module.css';
import { MouseEventHandler } from 'react';

function TeamDetailsCard(props: {
  team: TeamDetails;
  editTeam: MouseEventHandler<SVGElement>;
  deleteTeam: MouseEventHandler<SVGElement>;
  addUser: MouseEventHandler<SVGElement>;
  deleteUser: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Card css={{ mw: '290px', height: '90vh' }}>
      <Row wrap="wrap" justify="space-between">
        <Text h4 className="pt-[20px]" css={{ marginLeft: '5px' }}>
          {props.team.title}
        </Text>
        <ActionIcon className="absolute bottom-0 right-[40px]">
          <Edit onClick={props.editTeam} />
        </ActionIcon>
        <ActionIcon className="absolute bottom-0 right-0 mr-[10px]">
          <Trash onClick={props.deleteTeam} />
        </ActionIcon>
      </Row>
      <Text css={{ fontSize: '$tiny', marginLeft: '5px' }}>
        {props.team.description}
      </Text>
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
      <div className={styles.members + ' overflow-y-scroll p-[5px]'}>
        {props.team.members.map((member, index) => (
          <MemberCard
            key={index}
            member={member}
            deleteUser={props.deleteUser}
          />
        ))}
      </div>
    </Card>
  );
}

export default TeamDetailsCard;
