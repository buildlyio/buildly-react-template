import React from 'react'
import './Card.scss'
import Menu from '../Menu/Menu';
import EditableLabel from 'react-inline-edit';

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.chooseItem = this.chooseItem.bind(this);
    this.state = {
      menuItems: [
        {id: 'delete', title: 'Delete'}
      ],
      open: false
    }
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  toggleOpen() {
    this.setState({open: !this.state.open});
  }

  chooseItem(action) {
    this.props.action(action, this.props.id);
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  copmonentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  handleClickOutside(event) {
    if (this.state.open && this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.toggleOpen();
    }
  };

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  render() {
    return (
      <div className="card">
        <div className="card__container">
          <div className="card__image">
            <img src={this.props.image} />
          </div>
          <div className="card__overview">
            <div className="card__overview__first-line"><EditableLabel text={this.props.title} /></div>
            <div className="card__overview__second-line">{this.props.description}</div>
          </div>
          <div className="card__details">
            <div className="card__details__first-line">{this.props.price}</div>
            <div className="card__details__second-line">{Array.prototype.map.call(this.props.tags, tag => tag).toString()}</div>
          </div>
          <div className={'card__options' + (this.props.open ? ' card__options--open' : '')}>
            <div ref={this.setWrapperRef}>
              <Menu open={this.state.open} menuAction={this.chooseItem} menuItems={this.state.menuItems} />
              <button className="card__menu" onClick={this.toggleOpen}>...</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Card;