import { Card, User } from '@nextui-org/react';
import { CloseButton } from '@mantine/core';
import { MouseEventHandler, useEffect, useState } from 'react';
import Member from '../types/Member';

function MemberCard(props: {
  member: Member;
  deleteUser: MouseEventHandler<HTMLButtonElement>;
}) {
  const [profilePic, setProfilePic] = useState<string>(
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  );

  useEffect(() => {
    if (props.member.profilePic) {
      setProfilePic(props.member.profilePic);
    }
  }, [props]);

  return (
    <Card
      className="mw-px-220 m-px-5"
      bordered={false}
      shadow={false}
      css={{
        '&:hover': {
          background: '#99C08B',
        },
      }}
    >
      <div>
        <User
          src={profilePic}
          name={props.member.name}
          bordered
          className="p-0 max-w-fit"
        />
        <CloseButton
          onClick={props.deleteUser}
          className="mt-[7px] float-right"
        />
      </div>
    </Card>
  );
}

export default MemberCard;
