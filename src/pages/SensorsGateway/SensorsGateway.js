import React from 'react';
import { connect } from 'react-redux';
import Gateway from './Gateway/Gateway';
import Sensors from './Sensors/Sensors';

const SensorsGateway = (props) => (
  <>
    <Gateway {...props} />
    <Sensors {...props} />
  </>
);

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

export default connect(mapStateToProps)(SensorsGateway);
