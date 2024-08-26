/* eslint-disable no-nested-ternary */
import React from 'react';
import _ from 'lodash';
import {
  Grid,
  Typography,
  CardContent,
  Card,
} from '@mui/material';
import { getUser } from '@context/User.context';
import { SHIPMENT_OVERVIEW_COLUMNS } from '@utils/constants';
import '../ReportingStyles.css';

const ReportingActiveShipmentDetails = ({
  selectedShipment, theme, getShipmentValue,
}) => {
  const userLanguage = getUser().user_language;

  return (
    <div className="reportingInfoContainer">
      <Card>
        <CardContent>
          <Grid container>
            {selectedShipment
              ? (_.map(
                SHIPMENT_OVERVIEW_COLUMNS,
                (column, index) => (
                  <Grid
                    item
                    className="reportingInfoSection"
                    xs={12}
                    sm={6}
                    md={6}
                    key={`col${index}:${column.name}`}
                  >
                    <Typography variant="h6">
                      {column.label}
                    </Typography>
                    {column.name === 'custody_info' && selectedShipment[column.name]
                      ? (
                        <div
                          key="custody_info_last"
                          style={{
                            marginBottom: 10,
                            color: theme.palette.background.dark,
                          }}
                        >
                          <Typography variant="body1">
                            Name:
                            {' '}
                            <span className={_.find(selectedShipment[column.name], { has_current_custody: true }) && 'notranslate'}>
                              {`${_.find(selectedShipment[column.name], { has_current_custody: true })
                                ? _.find(selectedShipment[column.name], { has_current_custody: true }).custodian_name
                                : 'N/A'}`}
                            </span>
                          </Typography>
                          <Typography variant="body1">
                            {`Custodian Address: ${selectedShipment.contact_info[_.findIndex(selectedShipment[column.name], { has_current_custody: true })]
                              ? selectedShipment.contact_info[_.findIndex(selectedShipment[column.name], { has_current_custody: true })].address
                              : 'N/A'}`}
                          </Typography>
                        </div>
                      ) : (
                        <Typography variant="body1" className={column.className ? column.className : column.name === 'status' ? _.lowerCase(userLanguage) !== 'english' ? 'translate' : 'notranslate' : null}>
                          {getShipmentValue(column.name)}
                        </Typography>
                      )}
                  </Grid>
                ),
              ))
              : (
                <Typography
                  variant="h6"
                  align="center"
                >
                  Select a shipment to view reporting data
                </Typography>
              )}
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportingActiveShipmentDetails;
