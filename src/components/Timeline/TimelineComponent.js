import React from 'react';
import { Timeline, TimelineEvent } from '@mailtop/horizontal-timeline';
import { FaBug, FaRegCalendarCheck, FaRegFileAlt } from 'react-icons/fa';

const TimelineComponent = () => {
  const data = [];
  return (
    <Timeline minEvents={3} placeholder>
      <TimelineEvent
        icon={FaRegFileAlt}
        title="Em rascunho"
        subtitle="26/03/2019 09:51"
      />
      <TimelineEvent
        color="#87a2c7"
        icon={FaRegCalendarCheck}
        title="Agendado"
        subtitle="26/03/2019 09:51"
      />
      <TimelineEvent
        color="#9c2919"
        icon={FaBug}
        title="Erro"
        subtitle="26/03/2019 09:51"
        // action={{
        //   label: 'Ver detalhes...',
        //   onClick: () => window.alert('Error!'),
        // }}
      />
    </Timeline>
  );
};

export default TimelineComponent;
