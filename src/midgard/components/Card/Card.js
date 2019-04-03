import React from 'react'
import Menu from '../Menu/Menu'
import EditableLabel from 'react-inline-editing'
import { colors } from 'colors'
import { Button } from 'ui/Button/Button';
import styled, { css } from 'styled-components'

const CardWrapper = styled.div`
  display: flex;
  align-items: stretch;
  flex-direction: column;
  width: 100%;

  .card {
    margin: 6px 16px;
    flex: 1;
    position: relative;
    
    &__container {
      padding: 10px;
      box-shadow: 0 2px 3px 0 ${colors.shadow};
      background-color: ${colors.white};
      display: flex;
      height: 100%;
      box-sizing: border-box;
    }

    &__input {
      font-size: 14px;
      height: 100%;
      width: 100%;
    }

    &__image {
      padding: 0 10px;
      height: 80px;
      width: 80px;
      flex: none;

      img {
        max-width: 100%;
      }
    }

    &__overview {
      padding: 0 10px;
      flex: 2;

      &__first-line {
        font-weight: bold;
        height: 36px;
      }

      &__second-line {
        color: ${colors.grayMediumDarker};
        font-size: 15px;
      }
    }

    &__details {
      padding: 0 10px;
      flex: 1;

      &__first-line {
        color: ${colors.grayMediumDarker};
        height: 36px;
      }

      &__second-line {
        color: ${colors.primary};
      }
    }

    &__options {
      padding: 0 10px;
      flex: none;
      display: flex;
      align-items: center;
    }
  }

  ${props => props.cardView === 'list' && css`
    min-width: 100%;
  `}

  ${props => props.cardView === 'tile' && css`
    max-width: 320px;

    .card {
      &__container {
        flex: 1;
        flex-direction: column;
        position: relative;
      }

      &__image {
        height: 32px;
        width: 32px;
        position: absolute;
        top: 10px;
        right: 10px;
      }

      &__title {
        margin-right: 32px;
      }

      &__details {
        display: flex;
        font-size: 12px;

        > * {
          flex: 1;
          padding: 5px 0;
          height: initial;
        }
      }

      &__options {
        justify-content: flex-end;
      }
    }
  `}
`

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.selectAction = this.selectAction.bind(this);
    this.state = {
      menuItems: [
        {id: 'delete', title: 'Delete'}
      ],
      open: false
    };
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  /**
   * Toggles the options menu.
   */
  toggleMenu() {
    this.setState({open: !this.state.open});
  }

  /**
   * Selects an action from the options menu.
   * @param {string} action the selected action
   */
  selectAction(action) {
    this.props.action(action, this.props.id);
  }

  /**
   * Hand
   * @param {} event 
   */
  handleClickOutside(event) {
    if (this.state.open && this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.toggleMenu();
    }
  };

  setWrapperRef(ref) {
    this.wrapperRef = ref;
  }
  
  componentWillMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  render() {
    return (
      <CardWrapper cardView={this.props.cardView}>
        <div className="card">
          <div className="card__container">
            <div className="card__image">
              <img src={this.props.image} />
            </div>
            <div className="card__overview">
              <div className="card__overview__first-line">
                <EditableLabel inputClassName="card__input" text={this.props.title} />
              </div>
              <div className="card__overview__second-line">
                <EditableLabel inputClassName="card__input" text={this.props.description} />
                </div>
            </div>
            <div className="card__details">
              <div className="card__details__first-line">
                <EditableLabel inputClassName="card__input" text={this.props.price} />
              </div>
              <div className="card__details__second-line">
              <EditableLabel
                inputClassName="card__input"
                text={Array.prototype.map.call(this.props.tags, tag => tag).toString()} />
              </div>
            </div>
            <div className={'card__options' + (this.props.open ? ' card__options--open' : '')}>
              <div ref={this.setWrapperRef}>
                <Menu xPosition="right" yPosition="center" open={this.state.open} menuAction={this.selectAction} menuItems={this.state.menuItems} />
                <Button secondary small onClick={this.toggleMenu}>...</Button>
              </div>
            </div>
          </div>
        </div>
      </CardWrapper>
    )
  }
}

export default Card;