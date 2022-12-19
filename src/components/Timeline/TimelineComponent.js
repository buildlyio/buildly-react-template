import React from 'react';
import './TimelineComponent.css';
import { Timeline, TimelineEvent } from '@mailtop/horizontal-timeline';
import { FaBug, FaRegCalendarCheck, FaRegFileAlt } from 'react-icons/fa';

const TimelineComponent = () => {
  const data = [];
  return (
    <Timeline minEvents={4} height={360} placeholder>
      <TimelineEvent
        icon={FaRegFileAlt}
        title="POC"
        subtitle="15/01/2023"
        action={
          (
            <div className="feature-list m-2" style={{ backgroundColor: '#E0E0E0' }}>
              <ul className="p-2">
                <li>Feature 1</li>
                <li>Feature 2</li>
                <li>Feature 3</li>
                <li>Feature 4</li>
                <li>Feature 5</li>
              </ul>
            </div>
          )
        }
      />
      <TimelineEvent
        color="#F9943B"
        icon={FaRegCalendarCheck}
        title="MVP"
        subtitle="15/03/2023"
        action={
          (
            <div className="feature-list m-2" style={{ backgroundColor: '#F9943B' }}>
              <ul className="p-2">
                <li>Feature 1</li>
                <li>Feature 2</li>
                <li>Feature 3</li>
                <li>Feature 4</li>
                <li>Feature 5</li>
              </ul>
            </div>
          )
        }
      />
      <TimelineEvent
        color="#0C5594"
        icon={FaBug}
        title="Version 1.0.0"
        subtitle="15/06/2020"
        action={
          (
            <div className="feature-list m-2" style={{ backgroundColor: '#0C5594', color: '#fff' }}>
              <ul className="p-2">
                <li>Feature 1</li>
                <li>Feature 2</li>
                <li>Feature 3</li>
                <li>Feature 4</li>
                <li>Feature 5</li>
              </ul>
            </div>
          )
        }
      />
      <TimelineEvent
        color="#152944"
        icon={FaRegCalendarCheck}
        title="Version 1.2.0"
        subtitle="15/09/2023"
        action={
          (
            <div className="feature-list m-2" style={{ backgroundColor: '#152944', color: '#fff' }}>
              <ul className="p-2">
                <li>Feature 1</li>
                <li>Feature 2</li>
                <li>Feature 3</li>
                <li>Feature 4</li>
                <li>Feature 5</li>
              </ul>
            </div>
          )
        }
      />
    </Timeline>
  );
};

export default TimelineComponent;
