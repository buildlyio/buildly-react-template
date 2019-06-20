import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { colors } from 'colors'
import { rem } from 'polished'
import { FjInlineEditor, FjMenu, FjButton, FjCard } from 'freyja-react'
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
      padding: 0 ${rem(4)};

      &--primary {
        font-weight: bold;
      }

      &--secondary {
        color: ${colors.gray};
        font-size: ${rem(15)};
      }
    }

    &__small {
      margin: 0 ${rem(4)} ${rem(4)};
      font-size: ${rem(10)};
      color: ${colors.gray};
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
        max-height: 100%;
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
    &:not(.card-item__small) {
      word-break: break-all;

      &:empty {
        &::before {
          cursor: pointer;
          content: 'Click to edit';
          color: ${colors.lightGrayDarker};
        }
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

/**
 * Generic card layout for midgard client items.
 */
function CardItem({
  id,
  layout,
  action,
  options,
  image,
  pdf,
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

  /**
   * Calls the updates action.
   */
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
    let dateHeader1Formatted, dateHeader2Formatted;
  if (dateHeader1.value) {
       dateHeader1Formatted = new Intl.DateTimeFormat('en-US', dateOptions).format(new Date(dateHeader1.value));
  }
  if (dateHeader2.value) {
      dateHeader2Formatted = new Intl.DateTimeFormat('en-US', dateOptions).format(new Date(dateHeader2.value));
  }

  return (
    <CardItemWrapper
      layout={layout}>
      <FjCard
        content={
        <React.Fragment>
          <div className="card-item__field card-item__small">
            {dateHeader1.label} {dateHeader1Formatted} {dateHeader1 && dateHeader2 && '|'} {dateHeader2.label} {dateHeader2Formatted}
          </div>
          <div className="card-item__row">
            <div className="card-item__column card-item__column--flex">
              {details && <div
                onClick={(event) => event.stopPropagation()}
                className="card-item__field card-item__field--secondary">
                <FjInlineEditor
                  id={details.prop}
                  label={details.label}
                  placeholder={details.label}
                  value={details.value}
                  onChange={(event) => update(id, action, details.prop, event)} />
              </div>}
              {description && <div
                onClick={(event) => event.stopPropagation()}
                className="card-item__field card-item__field--secondary">
                <FjInlineEditor
                  id={description.prop}
                  label={description.label}
                  placeholder={description.label}
                  value={description.value}
                  onChange={(event) => update(id, action, description.prop, event)} />
              </div>}
            </div>
            <div className="card-item__column card-item__column--flex">
              {tags && <div
                onClick={(event) => event.stopPropagation()}
                className="card-item__field card-item__field--secondary">
                <FjInlineEditor
                  id={tags.prop}
                  label={tags.label}
                  placeholder={tags.label}
                  value={tags.value}
                  onChange={(event) => update(id, action, tags.prop, event)} />
              </div>}
            </div>
          </div>
        </React.Fragment>}>
        <div className="card-item__header">
          <div className="card-item__row">
            <div className="card-item__column">
              <div className="card-item__image" onClick={(event) => {
                if (image || pdf) {
                    window.open(image || pdf)
                }
                  event.stopPropagation();
              }
              }>
                <img src={image || defaultLogo} />
              </div>
            </div>
            <div className="card-item__column card-item__column--flex">
              {title && <div
                onClick={(event) => event.stopPropagation()}
                className="card-item__field card-item__field--primary">
                <FjInlineEditor
                  id={title.prop}
                  placeholder={title.label}
                  value={title.value}
                  tag="h4"
                  onChange={(event) => update(id, action, title.prop, event)} />
              </div>}
              {subText && <div
                onClick={(event) => event.stopPropagation()}
                className="card-item__field card-item__field--secondary">
                <FjInlineEditor
                  id={subText.prop}
                  placeholder={subText.label}
                  value={subText.value}
                  onChange={(event) => update(id, action, subText.prop, event)} />
              </div>}
              {subText2 && <div
                onClick={(event) => event.stopPropagation()}
                className="card-item__field card-item__field--secondary">
                <FjInlineEditor
                  id={subText2.prop}
                  placeholder={subText2.label}
                  value={subText2.value}
                  onChange={(event) => update(id, action, subText2.prop, event)} />
              </div>}
            </div>
            <div className="card-item__column card-item__column--flex">
              {caption && <div
                onClick={(event) => event.stopPropagation()}
                className="card-item__field card-item__field--secondary">
                <FjInlineEditor
                  id={caption.prop}
                  placeholder={caption.label}
                  value={caption.value}
                  onChange={(event) => update(id, action, caption.prop, event)} />
              </div>}
              {link && <div
                onClick={(event) => event.stopPropagation()}
                className="card-item__field card-item__field--secondary">
                <FjInlineEditor
                  id={link.prop}
                  placeholder={link.label}
                  value={link.value}
                  onChange={(event) => update(id, action, link.prop, event)} />
              </div>}
            </div>
            <div className="card-item__column">
              <div
                onClick={(event) => event.stopPropagation()}
                className="card-item__options">
                <FjMenu xPosition="right" yPosition="center" open={menuOpened} setOpen={toggleMenu} onActionClicked={(event) => selectAction(id, event, action)} menuItems={options}>
                  <FjButton variant="secondary" size="small" onClick={() => toggleMenu(!menuOpened)}>•••</FjButton>
                </FjMenu>
              </div>
            </div>
          </div>
        </div>
      </FjCard>
    </CardItemWrapper>
  )
}

export default CardItem;
