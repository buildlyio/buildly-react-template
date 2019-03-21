import React from 'react'
import './NavBar.scss'
import NavBarUser from './User/User';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.gotoProfile = this.gotoProfile.bind(this);
  }

  gotoProfile() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    this.props.history.push(from);
  }

  render() {
    return (
      <div className="nav-bar" id="exitPointComponent">
        <div className="nav-bar__container">
          <div id="navbar" className="nav-bar__elements">
          </div>
          <NavBarUser onClick={this.gotoProfile} />
        </div>
      </div>
    )
  }
}

export default NavBar;