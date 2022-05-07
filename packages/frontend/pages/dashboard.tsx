import type { NextPage } from 'next';
import CustomButton from '../components/Buttons/CustomButton';
import CustomCalendar from '../components/CustomCalendar/CustomCalendar';
import { events } from '../components/CustomCalendar/sampleEvents';
import EventCard, { Sizes } from '../components/EventCard/EventCard';
import { TeamCheckBox } from '../components/TeamCheckBox';
import Member from '../types/Member';

const Dashboard: NextPage = () => {
  const participants: Member[] = [
    {
      name: 'amy',
    },
    {
      name: 'sam',
    },
  ];

  const eventList = [
    {
      title: 'Event 1',
      date: new Date('01/02/2022'),
      timeRange: [new Date('01/02/2022, 13:30'), new Date('01/02/2022, 15:30')],
      description: 'this is a description',
      participants: participants,
    },
    {
      title: 'Event 2',
      date: new Date('01/02/2022'),
      timeRange: [new Date('01/02/2022, 13:30'), new Date('01/02/2022, 15:30')],
      description: 'this is a description',
      participants: participants,
    },
    {
      title: 'Event 3',
      date: new Date('01/02/2022'),
      timeRange: [new Date('01/02/2022, 13:30'), new Date('01/02/2022, 15:30')],
      description: 'this is a description',
      participants: participants,
    },
    {
      title: 'Event 4',
      date: new Date('01/02/2022'),
      timeRange: [new Date('01/02/2022, 13:30'), new Date('01/02/2022, 15:30')],
      description: 'this is a description',
      participants: participants,
    },
  ];

  const teams = [
    {
      title: 'SOFTENG750',
    },
    {
      title: 'SOFTENG701',
    },
    {
      title: 'SOFTENG754',
    },
    {
      title: 'PART4PROJECT',
    },
  ];

  return (
    <div className="w-full h-screen overflow-hidden flex flex-row my-10">
      <section className="w-1/2 h-full flex justify-center p-10">
        <div className="h-[80vh] min-h-[500px] mt-32">
          <CustomCalendar
            events={events}
            onParticipantClick={() => console.log('clicked')}
          />
        </div>
      </section>
      <section className="w-1/2 h-full pr-10 py-10">
        <div className="bg-white w-auto h-[52vh] min-w-[450px] min-h-[300px] rounded-xl p-10">
          <div className="flex flex-row items-center justify-between">
            <p className="font-medium text-[25px]">Upcomings</p>
            <CustomButton text="View All" onClick={() => {}} />
          </div>
          <div className="my-6 flex flex-col gap-2 h-4/5 overflow-scroll">
            {eventList.map((event) => {
              return (
                <EventCard
                  size={Sizes.small}
                  title={event.title}
                  date={event.date}
                  timeRange={[event.timeRange[0], event.timeRange[1]]}
                  participants={event.participants}
                  description={event.description}
                />
              );
            })}
          </div>
        </div>
        <div className="bg-white w-auto h-[30vh] mt-8 min-w-[450px] min-h-[320px] rounded-xl p-10">
          <div className="flex flex-row items-center justify-between">
            <p className="font-medium text-[25px]">Filter by teams</p>
            <CustomButton text="View All" onClick={() => {}} />
          </div>
          <div className="my-6 flex flex-col gap-2 h-3/4 overflow-scroll">
            {teams.map((team, index) => {
              return <TeamCheckBox label={team.title} order={index} />;
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
