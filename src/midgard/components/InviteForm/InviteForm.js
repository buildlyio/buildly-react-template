import React from 'react';
import styled from 'styled-components';
import { colors } from 'colors';
import { rem } from 'polished';

const InviteContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InviteCard = styled.div`
  background-color: ${colors.baseLightest};
  padding: 1rem;
  width: ${rem(320)};
`;

const InviteContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const InviteStyledForm = styled.form`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
`;

/**
 * Generic component to wrap form fields on the login and registration screens.
 */
function InviteForm({children, onSubmit}) {
  return (
    <InviteContainer>
      <InviteCard>
        <InviteContent>
          <InviteStyledForm onSubmit={onSubmit}>
            {children}
          </InviteStyledForm>
        </InviteContent>
      </InviteCard>
    </InviteContainer>
  );
}

export default InviteForm;