import React from 'react';

import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';

import './Report.css';

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
          <div className="m-2 row">
            <div className="col-md-7">
              <Card className="mb-2 row">
                <Card.Body>
                  <div className="m-2">
                    <RangeSlider />
                  </div>
                </Card.Body>
              </Card>
              <Card className="row">
                <Card.Body>
                  <Table striped bordered hover>
                    <thead>
                    <tr>
                      <th>PLATFORM DEV EXPENSES</th>
                      <th>BUDGET</th>
                    </tr>
                    <tr>
                      <th className="light-header">Payroll</th>
                      <th className="light-header">Monthly ($)</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>Lead Engineer (FullStack)</td>
                      <td>$6000</td>
                    </tr>
                    <tr>
                      <td>FronEnd Engineer</td>
                      <td>$4000</td>
                    </tr>
                    <tr>
                      <td>BackEnd Engineer</td>
                      <td>$5000</td>
                    </tr>
                    <tr>
                      <td>QA/Test Engineer</td>
                      <td>$4000</td>
                    </tr>
                    <tr>
                      <td>Project Manager</td>
                      <td>$6000</td>
                    </tr>
                    <tr>
                      <td>Technical Project Manager (Insights)</td>
                      <td>$0</td>
                    </tr>
                    <tr>
                      <td>Software Architect/CTO</td>
                      <td>$7000</td>
                    </tr>
                    <tr>
                      <th className="text-right totals-header">Payroll Total</th>
                      <th className="totals-header">$32000</th>
                    </tr>
                    </tbody>
                    <thead>
                    <tr>
                      <th className="light-header">Additional</th>
                      <th className="light-header">Monthly ($)</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>Dev Hosting</td>
                      <td>$500</td>
                    </tr>
                    <tr>
                      <td>Team Management</td>
                      <td>$500</td>
                    </tr>
                    <tr>
                      <td>Admin Hosting</td>
                      <td>$0</td>
                    </tr>
                    <tr>
                      <td>Licences & Fee</td>
                      <td>$0</td>
                    </tr>
                    <tr>
                      <td>Support(2 FTEs)</td>
                      <td>$4000</td>
                    </tr>
                    <tr>
                      <th className="text-right totals-header">Additional Total</th>
                      <th className="totals-header">$5000</th>
                    </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-5 row">
              <div className="col-md-6">
                <ListGroup as="ul">
                  <ListGroup.Item as="li" style={{ backgroundColor: '#FAFAFA' }}><b>POC</b></ListGroup.Item>
                  <ListGroup.Item as="li"><strong>8 Weeks</strong></ListGroup.Item>
                  <ListGroup.Item as="li" disabled>2 FTE Engineering</ListGroup.Item>
                  <ListGroup.Item as="li" disabled>1 Product Team</ListGroup.Item>
                  <ListGroup.Item as="li" disabled>1 Support</ListGroup.Item>
                  <ListGroup.Item as="li" disabled>1 Architect</ListGroup.Item>
                  <ListGroup.Item as="li" disabled>1 Lead Engineer</ListGroup.Item>
                  <ListGroup.Item as="li"><b>Cost: $45000</b></ListGroup.Item>
                </ListGroup>
              </div>
              <div className="col-md-6">
                <ListGroup as="ul">
                  <ListGroup.Item as="li" style={{ backgroundColor: '#F9943B' }}><b>MVP</b></ListGroup.Item>
                  <ListGroup.Item as="li"><strong>21 Weeks</strong></ListGroup.Item>
                  <ListGroup.Item as="li" disabled>2 FTE Engineering</ListGroup.Item>
                  <ListGroup.Item as="li" disabled>1 Product Team</ListGroup.Item>
                  <ListGroup.Item as="li" disabled>1 Support</ListGroup.Item>
                  <ListGroup.Item as="li" disabled>1 Architect</ListGroup.Item>
                  <ListGroup.Item as="li" disabled>1 Lead Engineer</ListGroup.Item>
                  <ListGroup.Item as="li"><b>Cost: $35000</b></ListGroup.Item>
                </ListGroup>
                </div>
              <div className="col-md-6">
                <ListGroup as="ul">
                  <ListGroup.Item as="li" style={{ backgroundColor: '#0C5594', color: '#fff' }}>
                    <b>Version 1.0.0</b>
                  </ListGroup.Item>
                  <ListGroup.Item as="li"><strong>12 Weeks</strong></ListGroup.Item>
                  <ListGroup.Item as="li" disabled>2 FTE Engineering</ListGroup.Item>
                  <ListGroup.Item as="li" disabled>1 Product Team</ListGroup.Item>
                  <ListGroup.Item as="li" disabled>1 Support</ListGroup.Item>
                  <ListGroup.Item as="li" disabled>1 Architect</ListGroup.Item>
                  <ListGroup.Item as="li" disabled>1 Lead Engineer</ListGroup.Item>
                  <ListGroup.Item as="li"><b>Cost: $54000</b></ListGroup.Item>
                </ListGroup>
              </div>
              <div className="col-md-6">
                <ListGroup as="ul">
                  <ListGroup.Item as="li" style={{ backgroundColor: '#152944', color: '#fff' }}>
                    <b>Version 1.2.0</b>
                  </ListGroup.Item>
                  <ListGroup.Item as="li"><strong>16 Weeks</strong></ListGroup.Item>
                  <ListGroup.Item as="li" disabled>2 FTE Engineering</ListGroup.Item>
                  <ListGroup.Item as="li" disabled>1 Product Team</ListGroup.Item>
                  <ListGroup.Item as="li" disabled>1 Support</ListGroup.Item>
                  <ListGroup.Item as="li" disabled>1 Architect</ListGroup.Item>
                  <ListGroup.Item as="li" disabled>1 Lead Engineer</ListGroup.Item>
                  <ListGroup.Item as="li"><b>Cost: $68000</b></ListGroup.Item>
                </ListGroup>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default Report;
