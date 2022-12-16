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
              <ul>
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
        color="#87a2c7"
        icon={FaRegCalendarCheck}
        title="MVP"
        subtitle="15/03/2023"
        action={
          (
            <div className="feature-list m-2" style={{ backgroundColor: '#86a2c7' }}>
              <ul>
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
        color="#9c2919"
        icon={FaBug}
        title="Version 1.0.0"
        subtitle="15/06/2020"
        action={
          (
            <div className="feature-list m-2" style={{ backgroundColor: '#9c2819' }}>
              <ul>
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
        color="#87a2c7"
        icon={FaRegCalendarCheck}
        title="Version 1.2.0"
        subtitle="15/09/2023"
        action={
          (
            <div className="feature-list m-2" style={{ backgroundColor: '#86a2c7' }}>
              <ul>
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
