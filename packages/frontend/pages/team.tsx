import { Button, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import TeamCard from '../components/TeamCard';
import TeamDetailsCard from '../components/TeamDetailsCard';
import {
  deleteTeam,
  getUser,
  getUserTeamsById,
  updateTeam,
} from '../helpers/apiCalls/apiCalls';
import { useAuth } from '../src/context/AuthContext';
import Member from '../types/Member';
import Team from '../types/Team';
import User from '../types/User';

const Team: NextPage = () => {
  const { userId, signedIn } = useAuth();

  const [teamsList, setTeamsList] = useState<Team[]>();

  const [loading, setLoading] = useState(true);

  const [selectedTeam, setSelectedTeam] = useState<Team>();

  const [editTeamModalOpen, setEditTeamModalOpen] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
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
      console.log(teams);
      setTeamsList(teams);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTeams();
  }, [signedIn]);

  const refresh = () => {
    window.location.reload();
  };

  const handleCardOnClick = (team: Team) => {
    setSelectedTeam(team);
    console.log(team);
  };

  const handleDeleteTeam = async (team: Team) => {
    if (team._id) {
      await deleteTeam(team._id);
      refresh();
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
      refresh();
    }
  };

  return (
    <div className="flex flex-row gap-[2vw] w-full h-full p-10 bg-backgroundgrey">
      <section className="w-[50vw] max-w-[840px]">
        <h1>Teams</h1>
        <div className="flex flex-row flex-wrap gap-8">
          {!loading && teamsList != undefined ? (
            Object.values(teamsList).map((team, index) => {
              console.log(team.membersList);
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
            <div>Loading ...</div>
          )}
        </div>
      </section>
      <section className="flex flex-auto w-fit">
        <div className="fixed mt-16">
          {selectedTeam && (
            <TeamDetailsCard
              team={selectedTeam}
              editTeam={() => {
                setEditTeamModalOpen(true);
              }}
              deleteTeam={() => handleDeleteTeam(selectedTeam)}
              addUser={() => {
                'edit';
              }}
              deleteUser={() => {
                console.log('delete');
              }}
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
                value={form.values.title}
                onChange={(e) =>
                  form.setFieldValue('title', e.currentTarget.value)
                }
              />
              <TextInput
                label="Team description"
                placeholder="Enter a team descriptoin"
                value={form.values.description}
                onChange={(e) =>
                  form.setFieldValue('description', e.currentTarget.value)
                }
              />
            </div>
            <div className="mt-5 flex-1 flex flex-row justify-end mx-4">
              <Button
                classNames={{
                  filled: 'bg-[#FFDF74] hover:bg-[#FFDF74]',
                  label: 'text-black',
                }}
                onClick={() => handleEditSubmit(form.values, selectedTeam)}
              >
                Done
              </Button>
            </div>
          </div>
        </Modal>
      </section>
    </div>
  );
};

export default Team;
