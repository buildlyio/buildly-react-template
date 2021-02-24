import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
    padding: theme.spacing(2),
    textAlign: "center",
  },
}))(MenuItem);

export default function AdminMenu(props) {
  const {
    settingEl,
    setSettingEl,
    handleUserManagementClick,
    handleAdminPanelClick,
  } = props;

  const handleClose = () => {
    setSettingEl(null);
  };

  return (
    <StyledMenu
      id="customized-admin"
      anchorEl={settingEl}
      keepMounted
      open={Boolean(settingEl)}
      onClose={handleClose}
    >
      <StyledMenuItem onClick={handleAdminPanelClick}>
        <ListItemText primary="Admin Panel" />
      </StyledMenuItem>
      <Divider />
      <StyledMenuItem onClick={handleUserManagementClick}>
        <ListItemText primary="User Management" />
      </StyledMenuItem>
    </StyledMenu>
  );
}
