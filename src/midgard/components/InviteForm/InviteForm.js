import React from 'react'
import styled from 'styled-components'
import { colors } from 'colors'
import { rem } from 'polished'

const InviteFormWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .invite { 
    &__card {
      background-color: ${colors.baseLightest};
      padding: 1rem;
      width: ${rem(320)};
      
      &__content {
        width: 100%;
        display: flex;
        flex-direction: column;
      }
    }

    &__form {
      display: flex;
      align-items: stretch;
      flex-direction: column;
        &__header {
            margin-bottom: ${rem(12)}
        }
    }
  }
`

/**
 * Generic component to wrap form fields on the login and registration screens.
 */
function InviteForm({children, onSubmit}) {
    return (
        <InviteFormWrapper className="invite">
            <div className="invite__card">
                <div className="invite__card__content">
                    <form className="invite__form" onSubmit={onSubmit}>
                        {children}
                    </form>
                </div>
            </div>
        </InviteFormWrapper>
    );
}

export default InviteForm;