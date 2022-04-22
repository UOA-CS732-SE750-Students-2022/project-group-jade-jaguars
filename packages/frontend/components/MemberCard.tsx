import { Card, User } from '@nextui-org/react';
import { CloseButton } from '@mantine/core';
import { useEffect, useState } from 'react';
import Member from '../types/Member';

function MemberCard(member: Member) {
  const [profilePic, setProfilePic] = useState<string>(
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  );

  useEffect(() => {
    if (member.profilePic) {
      setProfilePic(member.profilePic);
    }
  }, [member]);

  return (
    <Card css={{ mw: '220px', margin: '5px' }} bordered={false} shadow={false}>
      <div>
        <User
          src={profilePic}
          name={member.name}
          bordered
          css={{ padding: 0, maxWidth: 'fit-content' }}
        />
        <CloseButton
          onClick={() => {
            console.log('Deleting user...');
          }}
          style={{ float: 'right', marginTop: '7px' }}
        />
      </div>
    </Card>
  );
}

export default MemberCard;
