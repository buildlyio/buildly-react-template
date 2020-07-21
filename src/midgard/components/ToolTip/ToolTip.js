import React, { Children } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";

const useStyles = makeStyles((theme) => ({
  infoToolTip: {
    fontSize: "16px",
    marginLeft: theme.spacing(1),
    cursor: "pointer",
  },
}));

const StyledToolTip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
  arrow: {
    color: "#f5f5f9",
  },
}))(Tooltip);

export default function CustomizedTooltips(props) {
  const { toolTipText, children } = props;
  const classes = useStyles();
  return (
    <StyledToolTip
      arrow
      title={
        <React.Fragment>
          <Typography color="inherit">{toolTipText}</Typography>
        </React.Fragment>
      }
    >
      <InfoIcon
        color="primary"
        fontSize="small"
        className={classes.infoToolTip}
      />
    </StyledToolTip>
  );
}
