import React, { useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavDropdown } from "react-bootstrap";
import { Avatar } from "@mui/material";
import { Logout, Person } from "@mui/icons-material";
import { PeopleFill } from "react-bootstrap-icons";
import "./Navbar.css";

const MainNavbar = (props: any) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        variant="dark"
        fixed="top"
        sticky="top"
        className="custom-navbar px-4"
      >
        {/*<Container>*/}
        <a className="navbar-brand" href="#home">
          {/*<img src="/src/assets/img/logo.png" />*/}
        </a>
        {/*<Navbar.Brand href="#home">*/}
        {/*  <img*/}
        {/*    src="./../../assets/img/logo.png"*/}
        {/*    width="180"*/}
        {/*    className="d-inline-block align-top"*/}
        {/*    alt="Buildly insights"*/}
        {/*  />*/}
        {/*</Navbar.Brand>*/}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto main-nav-link">
            <Nav.Link href="#roadmap">Roadmap</Nav.Link>
            <Nav.Link href="#dashboard">Dashboard</Nav.Link>
            <Nav.Link href="#releases">Releases</Nav.Link>
            <Nav.Link href="#upgrade-plan">Upgrade plan</Nav.Link>
          </Nav>
          <Nav>
            <section className="user-info">
              <label>Jane Doe</label>
              <label>Buildly, Developer</label>
            </section>

            <NavDropdown
              id="nav-dropdown-dark-example"
              align={{ lg: "end" }}
              title={
                <span>
                  <Avatar
                    className="account-menu-icon"
                    sx={{
                      width: 32,
                      height: 32,
                    }}
                  >
                    <Person className="userIcon" />
                  </Avatar>
                </span>
              }
            >
              <NavDropdown.Item href="#action/3.1">
                <Person /> My profile
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                <PeopleFill /> User management
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.3">
                <Logout />
                Logout
              </NavDropdown.Item>
            </NavDropdown>

            {/*<Tooltip title="Account settings">*/}
            {/*  /!*<Dropdown>*!/*/}
            {/*  /!*  <Dropdown.Toggle id="dropdown-basic">*!/*/}
            {/*  /!*    <Avatar*!/*/}
            {/*  /!*      className="account-menu-icon"*!/*/}
            {/*  /!*      sx={{*!/*/}
            {/*  /!*        width: 32,*!/*/}
            {/*  /!*        height: 32,*!/*/}
            {/*  /!*      }}*!/*/}
            {/*  /!*    >*!/*/}
            {/*  /!*      <Person className="userIcon" />*!/*/}
            {/*  /!*    </Avatar>*!/*/}
            {/*  /!*  </Dropdown.Toggle>*!/*/}

            {/*  /!*  <Dropdown.Menu>*!/*/}
            {/*  /!*    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>*!/*/}
            {/*  /!*    <Dropdown.Item href="#/action-2">*!/*/}
            {/*  /!*      Another action*!/*/}
            {/*  /!*    </Dropdown.Item>*!/*/}
            {/*  /!*    <Dropdown.Item href="#/action-3">*!/*/}
            {/*  /!*      Something else*!/*/}
            {/*  /!*    </Dropdown.Item>*!/*/}
            {/*  /!*  </Dropdown.Menu>*!/*/}
            {/*  /!*</Dropdown>*!/*/}
            {/*  /!*<IconButton*!/*/}
            {/*  /!*  size="small"*!/*/}
            {/*  /!*  aria-controls={open ? "account-menu" : undefined}*!/*/}
            {/*  /!*  aria-haspopup="true"*!/*/}
            {/*  /!*  aria-expanded={open ? "true" : undefined}*!/*/}
            {/*  /!*  onClick={(e) => setAnchorEl(e.currentTarget)}*!/*/}
            {/*  /!*>*!/*/}
            {/*  /!*  <Avatar*!/*/}
            {/*  /!*    className="accountMenuIcon"*!/*/}
            {/*  /!*    sx={{*!/*/}
            {/*  /!*      width: 32,*!/*/}
            {/*  /!*      height: 32,*!/*/}
            {/*  /!*    }}*!/*/}
            {/*  /!*  >*!/*/}
            {/*  /!*    <Person className="userIcon" />*!/*/}
            {/*  /!*  </Avatar>*!/*/}
            {/*  /!*</IconButton>*!/*/}
            {/*</Tooltip>*/}
          </Nav>
        </Navbar.Collapse>
        {/*</Container>*/}
      </Navbar>
    </>
  );
};

export default MainNavbar;
