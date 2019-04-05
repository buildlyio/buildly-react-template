import React from 'react'
import Menu from '../Menu/Menu'
import EditableLabel from 'react-inline-editing'
import { colors } from 'colors'
import { Button } from 'ui/Button/Button';
import styled, { css } from 'styled-components'
import { rem } from 'polished'

const CardWrapper = styled.div`
  display: flex;
  align-items: stretch;
  flex-direction: column;
  width: 100%;

  .card {
    margin: ${rem(6)} ${rem(16)};
    flex: 1;
    position: relative;
    
    &__container {
      padding: ${rem(10)};
      box-shadow: 0 ${rem(2)} ${rem(3)} 0 ${colors.shadow};
      background-color: ${colors.white};
      display: flex;
      height: 100%;
      box-sizing: border-box;
    }

    &__input {
      font-size: ${rem(14)};
      height: 100%;
      width: 100%;
    }

    &__image {
      padding: 0 ${rem(10)};
      height: ${rem(80)};
      width: ${rem(80)};
      flex: none;

      img {
        max-width: 100%;
      }
    }

    &__overview {
      padding: 0 ${rem(10)};
      flex: 2;

      &__first-line {
        font-weight: bold;
        height: ${rem(36)};
      }

      &__second-line {
        color: ${colors.grayMediumDarker};
        font-size: ${rem(15)};
      }
    }

    &__details {
      padding: 0 ${rem(10)};
      flex: 1;

      &__first-line {
        color: ${colors.grayMediumDarker};
        height: ${rem(36)};
      }

      &__second-line {
        color: ${colors.primary};
      }
    }

    &__options {
      padding: 0 ${rem(10)};
      flex: none;
      display: flex;
      align-items: center;
    }
  }

  ${props => props.cardView === 'list' && css`
    min-width: 100%;
  `}

  ${props => props.cardView === 'tile' && css`
    max-width: ${rem(320)};

    .card {
      &__container {
        flex: 1;
        flex-direction: column;
        position: relative;
      }

      &__image {
        height: ${rem(32)};
        width: ${rem(32)};
        position: absolute;
        top: ${rem(10)};
        right: ${rem(10)};
      }

      &__title {
        margin-right: ${rem(32)};
      }

      &__details {
        display: flex;
        font-size: ${rem(12)};

        > * {
          flex: 1;
          padding: ${rem(5)} 0;
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
   * @param {string} action the selected action.
   */
  selectAction(action) {
    this.props.action(action, this.props.id);
  }

  /**
   * Closes the menu if the user clicks outside of the specified wrapper element.
   * @param {Event} event the click event.
   */
  handleClickOutside(event) {
    if (this.state.open && this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.toggleMenu();
    }
  };

  /**
   * Sets the wrapper element. 
   * @param ref the element to set.
   */
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
