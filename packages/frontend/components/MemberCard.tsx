import { Avatar, Card, User } from '@nextui-org/react';
import { CloseButton } from '@mantine/core';
import { MouseEventHandler, useEffect, useState } from 'react';
import Member from '../types/Member';

function MemberCard(props: {
  member: Member;
  deleteUser: (param?: any) => void;
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
    <div className="flex flex-row items-center justify-between gap-2 px-4 py-2 transition-colors rounded-lg cursor-pointer w-auto hover:bg-primary hover:text-white">
      <div className="flex flex-row gap-2 items-center">
        <Avatar
          pointer
          src={props.member.profilePic}
          text={props.member.name}
          bordered
          borderWeight="light"
        />
        <p className="w-36 overflow-hidden truncate ...">{props.member.name}</p>
      </div>

      <div>
        <CloseButton onClick={() => props.deleteUser(props.member)} />
      </div>
    </div>
  );
}

export default MemberCard;
