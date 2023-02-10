import React, { useEffect, useState } from 'react';
import './TimelineComponent.css';
import { Timeline, TimelineEvent } from '@mailtop/horizontal-timeline';

const TimelineComponent = ({ reportData, suggestedFeatures }) => {
  const [releaseData, setReleaseData] = useState([]);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    setReleaseData(reportData);
    setFeatures(suggestedFeatures);
  }, [reportData, suggestedFeatures]);
  return (
    <Timeline minEvents={6} height={360} placeholder>
      {(
        releaseData && releaseData.map((releaseItem, idx) => (
          <TimelineEvent
            key={idx}
            color={releaseItem.bgColor}
            icon={releaseItem.icon}
            title={releaseItem.name}
            subtitle={releaseItem.release_date}
            action={
              (
                (
                  releaseItem && releaseItem.features.length && (
                    <div className="feature-list m-2 p-2" style={{ backgroundColor: releaseItem.bgColor }}>
                      <ul className="p-2">
                        {(
                          releaseItem.features && releaseItem.features.map(
                            (feature, index) => (
                              <li key={`feat-${index}`}>{feature.name}</li>
                            ),
                          )
                        )}
                      </ul>
                    </div>
                  )
                ) || (
                  <div className="feature-list m-2 p-2" style={{ backgroundColor: releaseItem.bgColor }}>
                    <ul className="p-2">
                      {(
                        features && features.map(
                          (feature, index) => (
                            <li key={`feat-${index}`}>{`${feature?.suggested_feature}(Sug.)`}</li>
                          ),
                        )
                      )}
                    </ul>
                  </div>
                )
                || ''
              )
            }
          />
        ))
      )}
    </Timeline>
  );
};

export default TimelineComponent;
