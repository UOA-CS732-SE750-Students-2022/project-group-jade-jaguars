import TeamDetails from '../types/TeamDetails';
import { Card, Text, Row } from '@nextui-org/react';
import MemberCard from './MemberCard';
import { UserPlus, Edit, Trash } from 'tabler-icons-react';
import { ActionIcon } from '@mantine/core';

function TeamDetailsCard(team: TeamDetails) {
  return (
    <Card css={{ mw: '290px', height: '90vh' }}>
      <Row wrap="wrap" justify="space-between">
        <Text h4 css={{ paddingTop: '20px', marginLeft: '5px' }}>
          {team.title}
        </Text>
        <ActionIcon
          style={{ position: 'absolute', bottom: '0px', right: '40px' }}
        >
          <Edit
            onClick={() => {
              console.log('Editing team...');
            }}
          />
        </ActionIcon>
        <ActionIcon
          style={{
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            marginRight: '10px',
          }}
        >
          <Trash
            onClick={() => {
              console.log('Deleting team...');
            }}
          />
        </ActionIcon>
      </Row>
      <Text css={{ fontSize: '$tiny', marginLeft: '5px' }}>
        {team.description}
      </Text>
      <Row wrap="wrap" justify="space-between">
        <Text
          css={{
            paddingTop: '20px',
            marginLeft: '5px',
            maxWidth: 'fit-content',
            marginRight: '0px',
          }}
        >
          Members
        </Text>
        <ActionIcon
          style={{
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            marginRight: '10px',
          }}
        >
          <UserPlus
            onClick={() => {
              console.log('Adding user...');
            }}
          />
        </ActionIcon>
      </Row>
      <div className="members" style={{ overflowY: 'scroll', padding: '5px' }}>
        {team.members.map((member, index) => (
          <MemberCard key={index} {...member} />
        ))}
      </div>
    </Card>
  );
}

export default TeamDetailsCard;
