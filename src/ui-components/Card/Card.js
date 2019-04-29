import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { colors } from 'colors'
import { rem } from 'polished'

const FjCardWrapper = styled.div`
  display: flex;
  flex: 1;
  margin: ${rem(4)};
  align-items: flex-start;
  
  .card {
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

      .card {
        &__content {
          border-top: ${rem(1)} solid ${colors.grayLighter};
        }
      }
    }

    &:hover {
      background-color: ${colors.primaryLightest};
    }
  }
`

function FjCard({children, content}) {
  const [expanded, toggle] = useState(false);

  return (
    <FjCardWrapper expanded={expanded}>
      <div className="card" onClick={() => {toggle(!expanded)}}>
        <div className="card__header">
          <div className="card__content">
            {children}
          </div>
        </div>
        <div className="card__body">
          <div className="card__content">
            {content}
          </div>
        </div>
      </div>
    </FjCardWrapper>
  )
}

export default FjCard;