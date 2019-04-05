import React from 'react'
import './Item.scss'

class NavBarItem extends React.Component {
  constructor(props) {
    super(props);
    this.updateActive = this.updateActive.bind(this);
  }

  /**
   * Updates the active state of the nav bar item.
   */
  updateActive() {
    this.props.action(this.props.id);
  }

  render() {
    const { title, description, active } = this.props;
    return (
      <div className={'nav-bar-item ' + (active ? 'nav-bar-item--active' : '')} onClick={this.updateActive}>
        <div className="nav-bar-item__container">
          <div className="nav-bar-item__title">
            {title}
          </div>
          <div className="nav-bar-item__description">
            {description}
          </div>
        </div>
      </div>
    )
  }
}

export default NavBarItem;
