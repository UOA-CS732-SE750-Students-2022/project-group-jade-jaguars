import { convertToObjectId } from 'src/libs/utils.lib';
import { TeamModel } from 'src/schemas/team.schema';

//TODO: Add member to team
export async function addMemberToTeam(userId: string, teamId: string) {
  const uid = convertToObjectId(userId);
  const tid = convertToObjectId(teamId);
  await TeamModel.updateOne(
    {
      _id: tid,
    },
    { $push: { members: uid } },
  );
}
//TODO: Remove member from team
export async function removeMemberFromTeam(userId: string, teamId: string) {}

//TODO: Change admin?
