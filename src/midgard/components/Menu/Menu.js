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

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  copmonentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  handleClickOutside(event) {
    if (this.props.open && this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.close();
    }
  };

  setWrapperRef(node) {
    this.wrapperRef = node;
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