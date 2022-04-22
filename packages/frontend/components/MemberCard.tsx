import { Card, User } from '@nextui-org/react';
import { useEffect, useState } from 'react';

function MemberCard(memberUuid: string) {
  const [name, setName] = useState<string>('');
  const [profilePic, setProfilePic] = useState<string>('');

  useEffect(() => {
    // Get member's name and profile image:
    /* getAuth()
            .getUser(memberUuid)
            .then((userRecord) => {
                setName(userRecord.getDisplayName());
                setProfilePic(userRecord.getPhotoUrl());
            })
            .catch((error) => {
                console.log('Error fetching user data:', error);
            }); */
    setName('Bob');
    setProfilePic(
      'https://img.pixers.pics/pho_wat(s3:700/FO/23/80/66/66/700_FO23806666_a4cd1ba91572617e8833dcbd1d17a44c.jpg,700,700,cms:2018/10/5bd1b6b8d04b8_220x50-watermark.png,over,480,650,jpg)/wall-murals-the-letter-b.jpg.jpg',
    );
  }, [memberUuid]);

  return (
    <Card css={{ mw: '220px' }}>
      <User src={profilePic} name={name} bordered css={{ padding: 0 }} />
    </Card>
  );
}

export default MemberCard;
