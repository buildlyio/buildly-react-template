import React from 'react'
import './Card.scss'
import Menu from '../Menu/Menu';

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
  }

  toggleOpen() {
    this.setState({open: !this.state.open});
  }

  chooseItem(action) {
    this.props.action(action, this.props.id);
  }

  render() {
    return (
      <div className="card">
        <Menu close={() => this.state.open = false} open={this.state.open} menuAction={this.chooseItem} menuItems={this.state.menuItems} />
        <div className="card__container">
          <div className="card__image">
            <img src={this.props.image} />
          </div>
          <div className="card__overview">
            <div className="card__overview__first-line">{this.props.title}</div>
            <div className="card__overview__second-line">{this.props.description}</div>
          </div>
          <div className="card__details">
            <div className="card__details__first-line">{this.props.price}</div>
            <div className="card__details__second-line">{Array.prototype.map.call(this.props.tags, tag => tag).toString()}</div>
          </div>
          <div className={'card__options' + (this.props.open ? ' card__options--open' : '')}>
            <button className="card__menu" onClick={this.toggleOpen}>...</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Card;