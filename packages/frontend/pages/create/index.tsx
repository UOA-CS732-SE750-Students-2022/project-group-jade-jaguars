import { Alert, Container } from '@mantine/core';
import { Loading, Modal } from '@nextui-org/react';
import { useForm } from '@mantine/hooks';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import EventForm, { FormValues } from '../../components/EventForm/EventForm';
import { useAuth } from '../../src/context/AuthContext';
import { createTeam, createEvent } from '../../helpers/apiCalls/apiCalls';
import { EventResponseDTO } from '../../types/Event';

import { useRouter } from 'next/router';
import { getTZDate } from '../../helpers/timeFormatter';
import { AlertCircle, Bold } from 'tabler-icons-react';
import { toast, ToastContainer } from 'react-toastify';
import { LoadingOutlined, RedoOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

interface Team {
  id: string;
  label: string;
}

const CreateEventPage: NextPage = () => {
  const router = useRouter();
  const { userId, authToken } = useAuth();
  const [teamList, setTeamList] = useState<Team[]>([]);
  const defaultStartTime = new Date();
  const defaultEndTime = new Date();
  defaultStartTime.setHours(9, 0, 0, 0);
  defaultEndTime.setHours(17, 0, 0, 0);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [loading, setLoading] = useState(false);

  const newDate = new Date();
  newDate.setSeconds(0);

  const form = useForm<FormValues>({
    initialValues: {
      title: '',
      dateRange: [newDate, newDate],
      timeRange: [defaultStartTime, defaultEndTime],
      description: '',
      location: '',
      newTeam: false,
      teamName: '',
      newTeamName: '',
      newTeamDescription: '',
      recurring: false,
    },
  });
  const BASE_URL =
    process.env.NEXT_PUBLIC_SOCKET_URL! +
    (process.env.NEXT_PUBLIC_BASE_URL ?? 'api/v1');

  useEffect(() => {
    const getTeamList = async () => {
      const response = await fetch(BASE_URL + `/user/${userId}/team`, {
        headers: new Headers({
          Authorization: 'Bearer ' + authToken,
        }),
      });
      const data = await response.json();
      const team = await data.teams.map((team: any) => {
        return { id: team._id, label: team.title };
      });
      setTeamList(team);
    };
    getTeamList();
  }, []);
  const createNewTeam = async () => {
    const res = await createTeam({
      title: form.values.newTeamName,
      admin: userId,
      description: form.values.newTeamDescription,
    });
    return await res;
  };
  const createEventMethod = async (
    teamId: string,
  ): Promise<EventResponseDTO> => {
    const startDate = new Date(form.values.dateRange[0]!);
    const endDate = new Date(form.values.dateRange[1]!);
    const startTime = form.values.timeRange[0];
    const endTime = form.values.timeRange[1];
    startDate?.setHours(startTime.getHours(), startTime.getMinutes());
    endDate?.setHours(endTime.getHours(), endTime.getMinutes());
    const startDateText = startDate?.toISOString();
    const endDateText = endDate?.toISOString();

    const data = {
      title: form.values.title,
      description: form.values.description,
      startDate: getTZDate(new Date(startDateText)),
      endDate: getTZDate(new Date(endDateText)),
      admin: userId,
      location: form.values.location,
      team: teamId ? teamId : undefined,
      repeat: form.values.recurring,
    };

    const res = await createEvent(data);
    return res;
  };

  const onCreateEvent = async () => {
    setLoading(true);
    let teamId;
    if (form.values.newTeam) {
      if (form.values.newTeamName != '') {
        const data = await createNewTeam();
        teamId = await data.id;
      }
    } else {
      // Find team
      if (form.values.teamName) {
        teamId = teamList.find((o) => o.label == form.values.teamName)!.id;
      }
      // Otherwise team is left as undefined in event (has no associated team)
    }
    const response: EventResponseDTO = await createEventMethod(teamId);
    if (response) {
      router.push({
        pathname: '/availability/',
        query: { eventId: response.id },
      });
    } else {
      setLoading(false);
      setShowAlert(true);
    }
  };
  return (
    <Container style={{ maxWidth: '100vw' }} className="m-0 p-0">
      <div className="min-w-[1200px] flex flex-col h-full py-28 w-full items-center justify-center">
        <h1 className="mb-6">Create an event</h1>
        <div>
          <EventForm teamData={teamList} form={form} onSubmit={onCreateEvent} />
          <div className="w-[700px] text-center fixed bottom-14">
            {showAlert && (
              <Alert icon={<AlertCircle size={16} />} color={'red'}>
                {
                  'Please fill in all required details, description and team name length should be at least 3 characters long :)'
                }
              </Alert>
            )}
          </div>
        </div>
      </div>
      <div className="h-full flex items-center">
        <Modal open={loading}>
          <div className="flex flex-row gap-2 h-[100px] items-center justify-center w-full">
            <Loading color={'warning'} type="points" />
            Creading event...
          </div>
        </Modal>
      </div>
    </Container>
  );
};

export default CreateEventPage;
