import TeamDetails from '../types/TeamDetails';
import Member from '../types/Member';
import { Card, Text, Grid, Avatar } from '@nextui-org/react';
import { useEffect, useState } from 'react';

function TeamCard(team: TeamDetails) {
  const [members, setMembers] = useState<Member[]>([]);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let members = [...team.members];
    let count = members.length - 7;
    if (count < 0) {
      count = 0;
    }
    setCount(count);
    setMembers(members.splice(0, 7));
  }, [team]);

  return (
    <Card css={{ mw: '295px', height: '180px' }}>
      <Text h4 css={{ paddingTop: '20px', marginLeft: '5px' }}>
        {team.title}
      </Text>
      <Text css={{ fontSize: '$tiny', marginLeft: '5px' }}>
        {team.description}
      </Text>
      <Avatar.Group count={count} className="mt-[20px] ml-[5px] p-[5px]">
        {/* Map each member profile pic to an avatar */}
        {members.map((member, index) => {
          let photoUrl: string =
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
          if (member.profilePic) {
            photoUrl = member.profilePic;
          }
          return (
            <Avatar key={index} size="md" src={photoUrl} bordered stacked />
          );
        })}
      </Avatar.Group>
    </Card>
  );
}

export default TeamCard;
