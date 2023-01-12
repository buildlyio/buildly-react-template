import React, { useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';

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

const Report = ({ selectedProduct }) => {
  let displayReport = true;
  // states
  const [productData, setProductData] = useState([]);
  const [releaseData, setReleaseData] = useState([]);
  const [architectureImg, setArchitectureImg] = useState(null);
  // effects
  useEffect(() => {
    if (selectedProduct) {
      // define requests
      const requestsArray = [];
      // Load product data
      [`product/${selectedProduct}/report/`, `product_report/${selectedProduct}/`].forEach(
        (url, index) => {
          if (index === 0) {
            requestsArray.push(
              httpService.sendDirectServiceRequest(
                `product/${selectedProduct}/report/`,
                'GET',
                null,
                'product',
              ),
            );
          } else {
            requestsArray.push(
              httpService.sendDirectServiceRequest(
                `product_report/${selectedProduct}/`,
                'GET',
                null,
                'release',
              ),
            );
          }
        },
      );
      // handle promises
      Promise.all(requestsArray)
        .then((results) => {
          const reportData = results[0].data;
          const releaseReport = JSON.parse(JSON.stringify(results[1].data));

          if (reportData && reportData.budget) {
            // set the image to display
            let img = null;
            if (reportData.architecture_type.toLowerCase() === 'monolith') {
              img = monolith;
            } else if (reportData.architecture_type.toLowerCase() === 'microservice') {
              img = microservice;
            } else if (['micro-app', 'mini-app'].includes(reportData.architecture_type.toLowerCase())) {
              img = microApp;
            } else if (reportData.architecture_type.toLowerCase() === 'multicloud microservice') {
              img = multiCloud;
            }
            // set states
            setProductData(reportData);
            setArchitectureImg(img);
            // get release data
            releaseReport.release_budget = getReleaseBudgetData(
              reportData.budget?.team_data,
              releaseReport.release_data,
            );

            releaseReport.release_budget = addColorsAndIcons(
              JSON.parse(JSON.stringify(releaseReport.release_budget)),
            );
            // set release data
            setReleaseData(releaseReport);
          }
        })
        .catch((error) => {
          displayReport = false;
        });
    }
  }, []);

  if (selectedProduct && displayReport) {
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
                  <Image src={architectureImg} fluid style={{ height: '100%' }}/>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-5">
            <Card className="w-100">
              <Card.Body>
                <Card.Title>Buidly components</Card.Title>
                <div className="w-100 m-2">
                  <FlowChartComponent componentsData={productData && productData.components_tree}/>
                </div>
              </Card.Body>
            </Card>

          </div>
        </div>
        <Card className="w-100 mt-2">
          <Card.Body>
            <Card.Title>Timeline</Card.Title>
            <div className="m-2">
              <TimelineComponent
                reportData={releaseData.release_budget}
                suggestedFeatures={productData?.feature_suggestions}
              />
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
                            <tr key={`budget-${index}`}>
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
                            <tr key={`add-${index}`}>
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
                {(
                  releaseData && releaseData.release_budget && releaseData.release_budget.map(
                    (releaseItem, index) => (
                      <div className="col-md-6" key={`rc-${index}`}>
                        <ListGroup as="ul">
                          <ListGroup.Item
                            as="li"
                            style={{ backgroundColor: releaseItem.bgColor }}
                          >
                            <b>{releaseItem.name}</b>
                          </ListGroup.Item>
                          <ListGroup.Item as="li">
                            <strong>
                              { `${releaseItem?.duration.weeks} Weeks`}
                            </strong>
                          </ListGroup.Item>
                          {(
                            releaseItem.team && releaseItem.team.map(
                              (team, idx) => (
                                <ListGroup.Item
                                  key={`team-${idx}`}
                                  as="li"
                                  disabled
                                >
                                  {`${team.count} ${team.title}`}
                                </ListGroup.Item>
                              ),
                            )
                          )}
                          <ListGroup.Item as="li">
                            <b>
                              {
                                `Cost: $${(releaseItem.totalCost || 0.00) * releaseItem?.duration.months}`
                              }
                            </b>
                          </ListGroup.Item>
                        </ListGroup>
                      </div>
                    ),
                  )
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
      </>
    );
  }

  return (
    <Alert variant="warning">
      There was a problem loading report data
    </Alert>
  );
};

export default Report;
