import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Hidden from "@material-ui/core/Hidden";
import { AppContext } from "midgard/context/App.context";
import { SubNavContext } from "midgard/context/SubNav.context";
import logo from "assets/tp-logo.png";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#383636",
    // [theme.breakpoints.up("sm")]: {
    //   width: `calc(100% - ${240}px)`,
    //   marginLeft: 240,
    // },
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    // width: "100%",
    maxWidth: 160,
  },
  menuRight: {
    marginLeft: "auto",
  },
}));
// import logo from "assets/midgard-logo.svg";
// import searchIcon from "assets/icon-search.svg";
// import { colors } from "colors";
// import styled, { css } from "styled-components";
// import { rem } from "polished";

// import { FjContentSwitcher } from "freyja-react";

// const topBarHeight = rem(60);
// const searchSize = rem(32);

// const TopBarWrapper = styled.div`
//   height: ${topBarHeight};
//   max-height: ${topBarHeight};
//   display: flex;
//   background-color: ${colors.base};
//   transition: all linear 0.3s;
//   z-index: 3;

//   .top-bar {
//     &__main {
//       display: flex;
//       align-items: center;
//       padding: 0 ${rem(20)};
//       box-sizing: border-box;
//       width: ${rem(220)};
//       border-right: ${rem(1)} solid ${colors.baseDarker};
//     }

//     &__menu {
//       position: fixed;
//       top: ${rem(12)};
//       left: ${rem(20)};
//       z-index: 99;
//       height: ${rem(32)};
//       width: ${rem(32)};
//       display: flex;

//       &__icon {
//         position: relative;
//         flex: 1;
//         flex-direction: column;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         border-radius: ${rem(4)};
//         background-color: ${colors.white};
//         box-shadow: 0 ${rem(2)} ${rem(3)} 0 ${colors.shadow};

//         &:hover {
//           background-color: ${colors.primaryOverlay};
//         }
//       }
//     }

//     &__bar {
//       height: ${rem(2)};
//       background-color: ${colors.primary};
//       width: ${rem(16)};

//       &:not(:last-of-type) {
//         margin-bottom: ${rem(4)};
//       }
//     }

//     &__menu-container {
//       height: ${rem(32)};
//       width: ${rem(32)};
//       margin-right: ${rem(8)};
//       cursor: pointer;
//     }

//     &__title {
//       font-size: ${rem(14)};
//       line-height: ${rem(18)};
//       text-align: center;
//     }

//     &__logo {
//       height: ${rem(32)};
//       margin-right: ${rem(8)};
//     }

//     &__container {
//       display: flex;
//       flex: 1;
//       align-items: center;
//       justify-content: flex-start;
//       margin: ${rem(8)} 0;
//     }

//     &__content {
//       display: flex;
//       flex: 1;
//       align-items: center;
//       justify-content: space-between;
//       padding: 0 ${rem(24)};
//     }

//     &__search {
//       display: flex;
//       padding: 0 ${rem(16)};
//       &__input {
//         border-radius: ${rem(4)} 0 0 ${rem(4)};
//         height: ${searchSize} - ${rem(2)};
//         width: ${rem(240)};
//         border: ${rem(1)} solid transparent;
//         padding: 0 ${rem(10)};
//         font-size: ${rem(14)};
//         outline: none;

//         &::placeholder {
//           color: ${colors.gray};
//         }

//         &:focus {
//           border-color: ${colors.primary};
//         }
//       }

//       &__submit {
//         height: ${searchSize};
//         width: ${searchSize};
//         background-color: ${colors.primary};
//         border: ${rem(1)} solid transparent;
//         color: ${colors.white};
//         font-weight: bold;
//         border-radius: 0 ${rem(4)} ${rem(4)} 0;
//         cursor: pointer;
//         outline: none;
//         transition: all 0.2s linear;
//         padding: 0;

//         img {
//           height: ${rem(18)};
//           width: ${rem(18)};
//         }

//         &:hover {
//           background-color: ${colors.primaryDarker};
//         }
//       }
//     }
//   }

//   ${(props) =>
//     props.hidden &&
//     css`
//       max-height: 0;
//       overflow: hidden;

//       .top-bar {
//         &__menu {
//           &__icon {
//             background-color: ${colors.primary};

//             &:hover {
//               background-color: ${colors.primaryDarker};
//             }
//           }
//         }
//         &__bar {
//           background-color: ${colors.white};
//         }
//       }
//     `}
// `;

/**
 * Component for the top bar header.
 */
function TopBar({ navHidden, setNavHidden, history, location }) {
  const app = useContext(AppContext);
  const subNav = useContext(SubNavContext);
  // const search = (event) => {
  //   event.preventDefault();
  // }

  // let viewState = useState(subNav && subNav.length ? subNav[0].value : '');
  // const [view, setView] = viewState;

  // useEffect(() => {
  //   const selected = subNav.find(item => location.pathname.includes(item.value));
  //   if (selected) {
  //     setView(selected.value);
  //   }
  // }, [location.pathname.substr(0, location.pathname.lastIndexOf('/'))]);

  // useEffect(() => {
  //   const { from } = location.state || { from: { pathname: view } };
  //   history.push(`/app/${view}`);
  // }, [view]);

  // return (
  // <TopBarWrapper className="top-bar" hidden={navHidden}>
  //   <div className="top-bar__container">
  //     <div className="top-bar__main">
  //       <div className="top-bar__menu-container">
  //         <div className="top-bar__menu" onClick={() => setNavHidden(!navHidden)}>
  //           <div className="top-bar__menu__icon">
  //             <div className="top-bar__bar"></div>
  //             <div className="top-bar__bar"></div>
  //             <div className="top-bar__bar"></div>
  //           </div>
  //         </div>
  //       </div>
  //       <img className="top-bar__logo" src={logo} />
  //       <h1 className="top-bar__title">{app.appTitle}</h1>
  //     </div>
  //     <div className="top-bar__content">
  //       <FjContentSwitcher options={subNav} active={viewState} size="small" />
  //       <form className="top-bar__search" onSubmit={search}>
  //         <input className="top-bar__search__input" placeholder="Search" />
  //         <button className="top-bar__search__submit" type="submit">
  //           <img src={searchIcon} />
  //         </button>
  //       </form>
  //     </div>
  //   </div>
  // </TopBarWrapper>
  // )
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Hidden mdUp>
          <IconButton
            edge="start"
            className={classes.menuButton}
            onClick={() => setNavHidden(!navHidden)}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <img src={logo} className={classes.logo} />
        {auth && (
          <div className={classes.menuRight}>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
