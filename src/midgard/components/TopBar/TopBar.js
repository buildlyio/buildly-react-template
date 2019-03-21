import React from 'react'
import './TopBar.scss'

class TopBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="top-bar">
        <div className="top-bar__container">
          <div className="top-bar__search">
            <input className="top-bar__search__input" placeholder="Search" />
            <button className="top-bar__search__submit" type="submit">Go</button>
          </div>
        </div>
      </div>
    )
  }
}

export default TopBar;