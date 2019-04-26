import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { colors } from 'colors'
import { rem } from 'polished'

const FjCardItemWrapper = styled.div`
  display: flex;
  flex: 1;
  margin: ${rem(4)};
  align-items: flex-start;
  
  .card-item {
    box-shadow: 0 ${rem(2)} ${rem(3)} 0 ${colors.shadow};
    background-color: ${colors.white};
    display: flex;
    flex: 1;
    flex-direction: column;
    box-sizing: border-box;
    cursor: pointer;

    &__content {    
      padding: ${rem(20)};
    }

    &__body {
      max-height: 0;
      height: auto;
      overflow: hidden;
      transition: max-height linear 2s;
      ${props => props.expanded && css`
        max-height: 100vh;
      `}

      .card-item {
        &__content {
          border-top: ${rem(1)} solid ${colors.grayLighter};
        }
      }
    }
  }
`

function FjCardItem({children, content}) {
  const [expanded, toggle] = useState(false);

  return (
    <FjCardItemWrapper expanded={expanded}>
      <div className="card-item" onClick={() => {toggle(!expanded)}}>
        <div className="card-item__header">
          <div className="card-item__content">
            {children}
          </div>
        </div>
        <div className="card-item__body">
          <div className="card-item__content">
            {content}
          </div>
        </div>
      </div>
    </FjCardItemWrapper>
  )
}

export default FjCardItem;