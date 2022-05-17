import {
  Button,
  Container,
  Modal,
  Select,
  SelectItem,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { Loading } from '@nextui-org/react';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import TeamCard from '../components/TeamCard/TeamCard';
import TeamDetailsCard from '../components/TeamDetailsCard/TeamDetailsCard';
import {
  deleteTeam,
  getAllUsers,
  getUser,
  getUserTeamsById,
  updateTeam,
} from '../helpers/apiCalls/apiCalls';
import { useAuth } from '../src/context/AuthContext';
import Member from '../types/Member';
import Team, { UpdateTeamPayload } from '../types/Team';
import User from '../types/User';

const Team: NextPage = () => {
  const { userId, signedIn } = useAuth();

  const [teamsList, setTeamsList] = useState<Team[]>();
  const [usersList, setUsersList] = useState<SelectItem[]>();

  const [loading, setLoading] = useState(true);

  const [selectedTeam, setSelectedTeam] = useState<Team>();

  const [editTeamModalOpen, setEditTeamModalOpen] = useState(false);
  const [deleteTeamModalOpen, setDeleteTeamModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const teamForm = useForm({
    initialValues: {
      title: '',
      description: '',
    },
  });

  const memberForm = useForm({
    initialValues: {
      userId: '',
    },
  });

  const getTeams = async () => {
    setLoading(true);
    const response = await getUserTeamsById(userId);
    if (response) {
      const teams: Team[] = response.teams;
      await Promise.all(
        Object.values(teams).map(async (team) => {
          let membersList: Member[] = [];
          const members = team.members;
          if (members && members?.length > 0) {
            await Promise.all(
              Object.values(members).map(async (userId) => {
                const user: User = await getUser(userId);
                membersList.push({
                  name: user.firstName + ' ' + user.lastName,
                });
              }),
            );
            team.membersList = membersList;
          }
        }),
      );
      setTeamsList(teams);
      setLoading(false);
    }
  };

  const getUsers = async () => {
    const users: User[] = await getAllUsers();
    if (users) {
      const usersList = users.map((user) => {
        return {
          value: user.id!,
          label: user.firstName + ' ' + user.lastName,
        };
      });
      setUsersList(usersList);
    }
  };

  useEffect(() => {
    if (userId) {
      getTeams();
      getUsers();
    }
  }, [signedIn]);

  const handleCardOnClick = (team: Team) => {
    setSelectedTeam(team);
    setDetailModalOpen(true);
  };

  const handleDeleteTeam = async (team: Team) => {
    setDeleteTeamModalOpen(true);
  };

  const handleDeleteConfirm = async (team: Team) => {
    if (team._id) {
      await deleteTeam(team._id);
      setDeleteTeamModalOpen(false);
      setDetailModalOpen(false);
      getTeams();
    }
  };

  const handleEditSubmit = async (
    value: any,
    selectedTeam: Team | undefined,
  ) => {
    if (selectedTeam && selectedTeam._id) {
      const payload = value;
      if (value.title == '') {
        delete payload.title;
      }
      if (value.description == '') {
        delete payload.description;
      }
      await updateTeam(selectedTeam._id, value);
      setEditTeamModalOpen(false);
      setDetailModalOpen(false);
      getTeams();
    }
  };

  const handleAddMemberSubmit = async (values: any) => {
    const userId = values.userId;
    if (selectedTeam && selectedTeam._id) {
      let payload: UpdateTeamPayload = {};
      if (selectedTeam.members) {
        payload = {
          ...selectedTeam,
          members: [...selectedTeam.members, userId],
        };
      } else {
        payload = { ...selectedTeam, members: [userId] };
      }
      await updateTeam(selectedTeam?._id, payload);
      setAddMemberModalOpen(false);
      setDetailModalOpen(false);
      getTeams();
    }
  };

  return (
    <Container className="ml-[100px]">
      <div className="flex flex-row gap-[2vw] w-screen h-full p-10 bg-backgroundgrey">
        <section className="w-[50vw] max-w-[840px]">
          <h1>Teams</h1>
          <div className="flex flex-row flex-wrap gap-8">
            {!loading && teamsList != undefined ? (
              Object.values(teamsList).length > 0 ? (
                Object.values(teamsList).map((team, index) => {
                  return (
                    <TeamCard
                      key={index}
                      title={team.title}
                      description={team.description}
                      members={team.membersList}
                      onClick={() => handleCardOnClick(team)}
                    />
                  );
                })
              ) : (
                <div>No teams found, create one now!</div>
              )
            ) : (
              <div className="flex flex-row gap-2">
                <Loading color={'warning'} type="points" />
                Loading ...
              </div>
            )}
          </div>
        </section>
        <section className="flex flex-auto w-fit">
          <div className="fixed mt-16">
            {!loading && detailModalOpen && selectedTeam && (
              <TeamDetailsCard
                team={selectedTeam}
                editTeam={() => {
                  setEditTeamModalOpen(true);
                }}
                deleteTeam={() => handleDeleteTeam(selectedTeam)}
                addUser={() => setAddMemberModalOpen(true)}
              />
            )}
          </div>
        </section>
        <section>
          <Modal
            centered
            opened={editTeamModalOpen}
            onClose={() => setEditTeamModalOpen(false)}
            title={'Edit Team'}
          >
            <div className="my-3">
              <div className="flex flex-col gap-3 mx-4">
                <TextInput
                  label="Team name"
                  placeholder="Enter a team name"
                  value={teamForm.values.title}
                  onChange={(e) =>
                    teamForm.setFieldValue('title', e.currentTarget.value)
                  }
                />
                <TextInput
                  label="Team description"
                  placeholder="Enter a team descriptoin"
                  value={teamForm.values.description}
                  onChange={(e) =>
                    teamForm.setFieldValue('description', e.currentTarget.value)
                  }
                />
              </div>
              <div className="mt-5 flex-1 flex flex-row justify-end mx-4">
                <Button
                  classNames={{
                    filled: 'bg-[#FFDF74] hover:bg-[#FFDF74]',
                    label: 'text-black',
                  }}
                  onClick={() =>
                    handleEditSubmit(teamForm.values, selectedTeam)
                  }
                >
                  Done
                </Button>
              </div>
            </div>
          </Modal>

          <Modal
            opened={deleteTeamModalOpen}
            onClose={() => setDeleteTeamModalOpen(false)}
            centered
            size={'sm'}
          >
            <div>
              <p className=" text-xl font-medium text-center mx-8">
                Are you sure to delete this team?
              </p>
              <div className="flex flex-row my-8 justify-center gap-5">
                <button
                  className="py-2 px-3 rounded-md bg-secondary hover:bg-secondarylight"
                  onClick={() => {
                    setDeleteTeamModalOpen(false);
                  }}
                >
                  <span>Cancel</span>
                </button>
                <button
                  className="py-2 px-3 rounded-md bg-secondary hover:bg-secondarylight"
                  onClick={() => handleDeleteConfirm(selectedTeam!)}
                >
                  <span>Confirm</span>
                </button>
              </div>
            </div>
          </Modal>

          <Modal
            centered
            opened={addMemberModalOpen}
            onClose={() => setAddMemberModalOpen(false)}
            title={'Add Member'}
          >
            <div className="my-3">
              <div className="flex flex-col gap-3 mx-4">
                <Select
                  data={usersList!}
                  label="Select a user"
                  value={memberForm.values.userId}
                  onChange={(e) => memberForm.setFieldValue('userId', e!)}
                />
                <div className="mt-5 flex-1 flex flex-row justify-end">
                  <Button
                    classNames={{
                      filled: 'bg-[#FFDF74] hover:bg-[#FFDF74]',
                      label: 'text-black',
                    }}
                    onClick={() => handleAddMemberSubmit(memberForm.values)}
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        </section>
      </div>
    </Container>
  );
};

export default Team;
