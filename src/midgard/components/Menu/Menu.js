import React from 'react'
import './Menu.scss'

class Menu extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Outputs the menu items
   */
  listItems() {
    const items = [];
    for (const item of this.props.menuItems) {
      items.push(<li className="menu__item"
        key={item.id}
        onClick={() => {this.props.menuAction(item.id)}}>
        {item.title}
      </li>);
    }
    return items;
  }

  render() {
    const { open } = this.props;
    return (
      <div className={'menu ' + (open ? 'menu--open' : '')}>
        <ul className="menu__list">
          {this.listItems()}
        </ul>
      </div>
    )
  }
}

export default Menu;