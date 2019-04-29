import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { colors } from 'colors'
import { rem } from 'polished'
import FjCard from 'ui-components/Card/Card'
import { Button } from 'ui-components/Button/Button'
import Menu from 'ui/Menu/Menu'
import EditableLabel from 'react-inline-editing'
import defaultLogo from 'assets/midgard-logo.svg'

const CardItemWrapper = styled.div`
  display: flex;
  align-items: stretch;
  flex-direction: column;
  width: 100%;

  .card-item {
    &__row {
      display: flex;
      flex-direction: row;
    }

    &__column {
      &--flex {
        flex: 1;
      }
    }

    &__field {
      margin: ${rem(4)};

      &--primary {
        font-weight: bold;
      }

      &--secondary {
        color: ${colors.grayMediumDarker};
        font-size: ${rem(15)};
      }
    }

    &__small {
      margin: ${rem(4)};
      font-size: ${rem(12)};
      color: ${colors.grayLight};
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

    &__options {
      padding: 0 ${rem(10)};
      flex: none;
      display: flex;
      align-items: center;
    }
  }

  label {
    word-break: break-all;

    &:empty {
      &::before {
        content: 'Click to edit';
        color: ${colors.grayMedium};
      }
    }
  }

  ${props => props.layout === 'list' && css`
    min-width: 100%;
  `}

  ${props => props.layout === 'tile' && css`
    max-width: ${rem(320)};

    .card-item {
      &__row {
        flex-direction: column;
      }

      &__image {
        display: flex;
        margin: auto;
      }

      &__options {
        justify-content: flex-end;
      }
    }
  `}

  ${props => props.disabled && css`
    opacity: 0.5;
    pointer-events: none;
  `}
`


function CardItem({
  id,
  layout,
  action,
  options,
  title,
  subText,
  subText2,
  caption,
  link,
  dateHeader1,
  dateHeader2,
  details,
  description,
  tags
}) {
  const [menuOpened, toggleMenu] = useState(false);

  const update = (id, action, label, value) => {
    action('update', id, { [label]: value });
  }

  /**
   * Selects an action from the options menu.
   * @param {string} action the selected action.
   */
  const selectAction = (id, event, action) => {
    action(event, id, {});
  }

  const dateOptions = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
  };
  const dateHeader1Formatted = new Intl.DateTimeFormat('en-US', dateOptions).format(new Date(dateHeader1.value));
  const dateHeader2Formatted = new Intl.DateTimeFormat('en-US', dateOptions).format(new Date(dateHeader2.value));

  return (
    <CardItemWrapper
      layout={layout}>
      <FjCard
        content={
        <React.Fragment>
          <div className="card-item__small">{dateHeader1.label} {dateHeader1Formatted} | {dateHeader2.label} {dateHeader2Formatted}</div>
          <div className="card-item__row">
            <div className="card-item__column card-item__column--flex">
              <div 
                onClick={(event) => event.stopPropagation()}
                className="card-item__field card-item__field--secondary">
                <EditableLabel
                  inputPlaceHolder={details.label}
                  inputClassName="card-item__input"
                  text={details.value}
                  onFocusOut={(event) => update(id, action, details.prop, event)} />
              </div>
              <div 
                onClick={(event) => event.stopPropagation()}
                className="card-item__field card-item__field--secondary">
                <EditableLabel
                  inputPlaceHolder={description.label}
                  inputClassName="card-item__input"
                  text={description.value}
                  onFocusOut={(event) => update(id, action, description.prop, event)} />
              </div>
            </div>
            <div className="card-item__column card-item__column--flex">
              <div 
                onClick={(event) => event.stopPropagation()}
                className="card-item__field card-item__field--secondary">
                <EditableLabel
                  inputPlaceHolder={tags.label}
                  inputClassName="card-item__input"
                  text={tags.value}
                  onFocusOut={(event) => update(id, action, tags.prop, event)} />
              </div>
            </div>
          </div>
        </React.Fragment>}>
        <div className="card-item__header">
          <div className="card-item__row">
            <div className="card-item__column">
              <div className="card-item__image" onClick={(event) => event.stopPropagation()}>
                <img src={defaultLogo} />
              </div>
            </div>
            <div className="card-item__column card-item__column--flex">
              <div 
                onClick={(event) => event.stopPropagation()}
                className="card-item__field card-item__field--primary">
                <EditableLabel
                  inputPlaceHolder={title.label}
                  inputClassName="card-item__input"
                  text={title.value}
                  onFocusOut={(event) => update(id, action, title.prop, event)} />
              </div>
              <div 
                onClick={(event) => event.stopPropagation()}
                className="card-item__field card-item__field--secondary">
                <EditableLabel
                  inputPlaceHolder={subText.label}
                  inputClassName="card-item__input"
                  text={subText.value}
                  onFocusOut={(event) => update(id, action, subText.prop, event)} />
              </div>
              <div 
                onClick={(event) => event.stopPropagation()}
                className="card-item__field card-item__field--secondary">
                <EditableLabel
                  inputPlaceHolder={subText2.label}
                  inputClassName="card-item__input"
                  text={subText2.value}
                  onFocusOut={(event) => update(id, action, subText2.prop, event)} />
              </div>
            </div>
            <div className="card-item__column card-item__column--flex">
              <div 
                onClick={(event) => event.stopPropagation()}
                className="card-item__field card-item__field--secondary">
                <EditableLabel
                  inputPlaceHolder={caption.label}
                  inputClassName="card-item__input"
                  text={caption.value}
                  onFocusOut={(event) => update(id, action, caption.prop, event)} />
              </div>
              <div 
                onClick={(event) => event.stopPropagation()}
                className="card-item__field card-item__field--secondary">
                <EditableLabel
                  inputPlaceHolder={link.label}
                  inputClassName="card-item__input"
                  text={link.value}
                  onFocusOut={(event) => update(id, action, link.prop, event)} />
              </div>
            </div>
            <div className="card-item__column">
              <div 
                onClick={(event) => event.stopPropagation()}
                className="card-item__options">
                <Menu xPosition="right" yPosition="center" open={menuOpened} setOpen={toggleMenu} onActionClicked={(event) => selectAction(id, event, action)} menuItems={options}>
                  <Button secondary small onClick={() => toggleMenu(!menuOpened)}>...</Button>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </FjCard>
    </CardItemWrapper>
  )
}

export default CardItem;