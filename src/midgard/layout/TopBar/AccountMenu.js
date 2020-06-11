import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SendIcon from "@material-ui/icons/Send";
import Typography from "@material-ui/core/Typography";
import { Divider, Box } from "@material-ui/core";

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
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
    padding: theme.spacing(2),
    textAlign: "center",
  },
}))(MenuItem);

export default function AccountMenu(props) {
  const {
    anchorEl,
    setAnchorEl,
    user,
    handleLogoutClick,
    handleMyAccountClick,
  } = props;

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Box mb={2} p={2} justifyContent={"center"} textAlign={"center"}>
          <Typography variant={"h6"}>
            {user && `${user.first_name} ${user.last_name}`}
          </Typography>
          <Typography variant={"body2"}>{user && `${user.email}`}</Typography>
          <Typography variant={"body1"}>
            {user && `Works at: ${user.organization.name}`}
          </Typography>
        </Box>

        <Divider />
        <StyledMenuItem onClick={handleMyAccountClick}>
          <ListItemText primary="My Account" />
        </StyledMenuItem>
        <Divider />
        <StyledMenuItem onClick={handleLogoutClick}>
          <ListItemText primary="Logout" />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
}
