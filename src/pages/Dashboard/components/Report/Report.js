import React, { useEffect, useState } from 'react';

import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';

import './Report.css';

import TimelineComponent from '@components/Timeline/TimelineComponent';
import RangeSlider from '@components/RangeSlider/RangeSlider';
import FlowChartComponent from '@components/FlowChart/FlowChart';
import { httpService } from '@modules/http/http.service';

// architecture designs
import microservice from '@assets/architecture-suggestions/GCP - MicroServices.png';
import monolith from '@assets/architecture-suggestions/GCP - Monolithic.png';
import multiCloud from '@assets/architecture-suggestions/GCP - MicroServices w_ DataPipeline.png';
import microApp from '@assets/architecture-suggestions/Digital Ocean - MicroApp w_ FrontEnd.png';
import { addColorsAndIcons, getReleaseBudgetData } from '@pages/Dashboard/components/Report/utils';

const Report = ({ product }) => {
  // states
  const [productData, setProductData] = useState([]);
  const [releaseData, setReleaseData] = useState([]);
  const [architectureImg, setArchitectureImg] = useState(null);
  // effects
  useEffect(() => {
    // Load product data
    httpService.makeRequest(
      'GET',
      'http://localhost:8080/product/53d42614-c4b8-4a5e-8875-a36a0bd7f1eb/report/',
      null,
      false,
    )
      .then((response) => {
        const reportData = response.data;
        // set report data

        console.log('Report Data: ', reportData);
        if (reportData) {
          // set the image to display
          let img = null;
          if (reportData.architecture_type.toLowerCase() === 'monolith') {
            img = monolith;
          } else if (reportData.architecture_type.toLowerCase() === 'microservice') {
            img = microservice;
          } else if (reportData.architecture_type.toLowerCase() === 'micro-app') {
            img = microApp;
          } else if (reportData.architecture_type.toLowerCase() === 'multicloud microservice') {
            img = multiCloud;
          }
          // set states
          setProductData(reportData);
          setArchitectureImg(img);

          // get release data
          httpService.makeRequest(
            'GET',
            'http://localhost:8081/product_report/4b7434ad-ff6d-42ec-ac40-efd71ef09d98/',
            null,
            false,
          ).then((releaseRes) => {
            const releaseReport = releaseRes.data;
            releaseReport.release_budget = getReleaseBudgetData(
              reportData.budget?.team_data,
              releaseReport.release_data,
            );

            releaseReport.release_data = addColorsAndIcons(
              JSON.parse(JSON.stringify(releaseReport.release_data)),
            );
            // set release data
            setReleaseData(releaseReport);
          });
        }
      });
  }, []);
  return (
    <>
      <div className="row">
        <div className="col-md-7">
          <Card className="w-100">
            <Card.Body>
              <Card.Title>
                {`Architecture suggestion: (${productData?.architecture_type?.toUpperCase()})`}
              </Card.Title>
              <div className="image-responsive m-2" style={{ height: 350 }}>
                <Image src={architectureImg} fluid style={{ height: '100%' }} />
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-5">
          <Card className="w-100">
            <Card.Body>
              <Card.Title>Buidly components</Card.Title>
              <div className="w-100 m-2">
                <FlowChartComponent/>
              </div>
            </Card.Body>
          </Card>

        </div>
      </div>
      <Card className="w-100 mt-2">
        <Card.Body>
          <Card.Title>Timeline</Card.Title>
          <div className="m-2">
            <TimelineComponent reportData={releaseData.release_data} />
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
                    <RangeSlider rangeValues={productData?.budget_range}/>
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
                      {
                        productData && productData.budget && productData.budget?.team_data.map(
                          (item, index) => (
                            <tr key={index}>
                              <td>{item.role}</td>
                              <td>{`$${item.budget}`}</td>
                            </tr>
                          ),
                        )
                      }
                      <tr>
                        <th className="text-right totals-header">Payroll Total</th>
                        <th className="totals-header">
                          {`$${(productData && productData.budget
                          && productData.budget?.total_budget) || '0.00'}`}
                        </th>
                      </tr>
                    </tbody>
                    <thead>
                      <tr>
                        <th className="light-header">Additional</th>
                        <th className="light-header">Monthly ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        productData && productData.budget
                        && productData.budget.other_costs?.map(
                          (item, index) => (
                            <tr key={index}>
                              <td>{item.item}</td>
                              <td>{`$${item.cost}`}</td>
                            </tr>
                          ),
                        )
                      }
                      <tr>
                        <th className="text-right totals-header">Additional Total</th>
                        <th className="totals-header">
                          {`$${(productData && productData.budget
                            && productData.budget?.total_costs) || '0.00'}`}
                        </th>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-5 row">
              <div className="col-md-6">
                <ListGroup as="ul">
                  <ListGroup.Item
                    as="li"
                    style={{ backgroundColor: '#FAFAFA' }}
                  >
                    <b>POC</b>
                  </ListGroup.Item>
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
                  <ListGroup.Item as="li"
                                  style={{ backgroundColor: '#F9943B' }}><b>MVP</b></ListGroup.Item>
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
                  <ListGroup.Item
                    as="li"
                    style={
                      {
                        backgroundColor: '#0C5594',
                        color: '#fff',
                      }
                    }
                  >
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
                  <ListGroup.Item as="li" style={{
                    backgroundColor: '#152944',
                    color: '#fff'
                  }}>
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
