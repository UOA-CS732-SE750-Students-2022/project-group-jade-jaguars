import Team from '../types/Team';
import { Card, Text, Grid, Avatar } from '@nextui-org/react';
import { useEffect, useState } from 'react';

function TeamCard(props: Team) {
  const [members, setMembers] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let members = [...props.members];
    let count = members.length - 7;
    if (count < 0) {
      count = 0;
    }
    setCount(count);
    setMembers(members.splice(0, 7));
  }, [props]);

  return (
    <Card css={{ mw: '290px', height: '180px' }}>
      <Text h4 css={{ paddingTop: '20px', marginLeft: '5px' }}>
        {props.title}
      </Text>
      <Text css={{ fontSize: '$tiny', marginLeft: '5px' }}>
        {props.description}
      </Text>
      <Avatar.Group
        count={count}
        css={{ marginLeft: '5px', marginTop: '20px', padding: '5px' }}
      >
        {/* Map each member profile pic to an avatar */}
        {members.map((member, index) => {
          const photoUrl = member;
          /* let photoUrl = "";
                            // Get member's profile image:
                            getAuth()
                                .getUser(member)
                                .then((userRecord) => {
                                    photoUrl = userRecord.getPhotoUrl();
                                })
                                .catch((error) => {
                                    console.log('Error fetching user data:', error);
                                }); */

          return (
            <Avatar key={index} size="md" src={photoUrl} bordered stacked />
          );
        })}
      </Avatar.Group>
    </Card>
  );
}

export default TeamCard;
