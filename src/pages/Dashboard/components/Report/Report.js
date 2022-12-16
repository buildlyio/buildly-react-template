import React from 'react';

import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

import TimelineComponent from '@components/Timeline/TimelineComponent';
import RangeSlider from '@components/RangeSlider/RangeSlider';

// architecture designs
import microservice from '@assets/architecture-suggestions/GCP - MicroServices.png';
import monolith from '@assets/architecture-suggestions/GCP - Monolithic.png';
import FlowChartComponent from '@components/FlowChart/FlowChart';

const Report = ({ product }) => {
  const data = [];
  return (
    <>
      <div className="row">
        <div className="col-md-7">
          <Card className="w-100">
            <Card.Body>
              <Card.Title>Architecture suggestion: MicroServices</Card.Title>
              <div className="image-responsive m-2" style={{ height: 350 }}>
                <Image src={microservice} fluid style={{ height: '100%' }} />
              </div>
            </Card.Body>
          </Card>
          <Card className="w-100 mt-2">
            <Card.Body>
              <Card.Title>Timeline</Card.Title>
              <div className="m-2">
                <TimelineComponent />
              </div>
            </Card.Body>
          </Card>
          <Card className="w-100 mt-2 mb-4">
            <Card.Body>
              <Card.Title>Budget estimate</Card.Title>
              <div className="m-2">
                <RangeSlider />
                <div className="row">
                  <ListGroup as="ol" numbered>
                    <ListGroup.Item
                      as="li"
                      className="d-flex justify-content-between align-items-start"
                    >
                      <div className="ms-2 me-auto">
                        <div className="fw-bold">Subheading</div>
                        Cras justo odio
                      </div>
                      <Badge bg="primary" pill>
                        $ 16000
                      </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item
                      as="li"
                      className="d-flex justify-content-between align-items-start"
                    >
                      <div className="ms-2 me-auto">
                        <div className="fw-bold">Subheading</div>
                        Cras justo odio
                      </div>
                      <Badge bg="primary" pill>
                        $ 15500
                      </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item
                      as="li"
                      className="d-flex justify-content-between align-items-start"
                    >
                      <div className="ms-2 me-auto">
                        <div className="fw-bold">Subheading</div>
                        Cras justo odio
                      </div>
                      <Badge bg="primary" pill>
                        $ 140000
                      </Badge>
                    </ListGroup.Item>
                  </ListGroup>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-5">
          <Card className="w-100">
            <Card.Body>
              <Card.Title>Buidly components</Card.Title>
              <div className="w-100 m-2">
                <FlowChartComponent />
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Report;
