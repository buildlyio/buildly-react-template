import React from 'react'
import './TopBar.scss'
import logo from 'assets/midgard-logo.svg';
import searchIcon from 'assets/icon-search.svg';

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.toggleNav = this.toggleNav.bind(this);
  }

  toggleNav() {
    this.props.action(!this.props.navHidden);
  }

  render() {
    return (
      <div className={ 'top-bar ' + (this.props.navHidden ? 'top-bar--hidden' : '') }>
        <div className="top-bar__container">
          <div className="top-bar__main">
            <div className="top-bar__menu-container">
              <div className="top-bar__menu" onClick={this.toggleNav}>
                <div className="top-bar__menu__icon">
                  <div className="top-bar__bar"></div>
                  <div className="top-bar__bar"></div>
                  <div className="top-bar__bar"></div>
                </div>
              </div>
            </div>
            <img className="top-bar__logo" src={logo} />
            <h1 className="top-bar__title">Demo App</h1>
          </div>
          <div className="top-bar__search">
            <input className="top-bar__search__input" placeholder="Search" />
            <button className="top-bar__search__submit" type="submit">
              <img src={searchIcon} />
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default TopBar;