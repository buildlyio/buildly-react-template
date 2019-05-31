import React from 'react'
import styled from 'styled-components'
import { colors } from 'colors'
import { rem } from 'polished'
import logo from 'assets/midgard-logo.svg'
import { Link } from 'react-router-dom'
import Crud, { CrudContext } from 'midgard/modules/crud/Crud'
import { useContext } from 'react'

const AuthFormWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .auth { 
    &__card {
      background-color: ${colors.baseLightest};
      box-shadow: 0 ${rem(2)} ${rem(3)} 0 ${colors.shadow};
      padding: 1.5rem;
      width: ${rem(320)};
      
      &__logo {
        display: block;
        width: ${rem(100)};
        margin: ${rem(30)} auto;
      }
      
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

      &__link {
        text-decoration: none;
        color: ${colors.primary};
        font-size: ${rem(12)};

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`


/**
 * Generic component to wrap form fields on the login and registration screens.
 */
function AuthForm({children, onSubmit, link}) {
    return (
      <AuthFormWrapper className="auth">
        <div className="auth__card">
          <div className="auth__card__content">
            <img className="auth__card__logo" src={logo} />
            <form className="auth__form" onSubmit={onSubmit}>
              {children}
              <Link className="auth__form__link" to={{
                  pathname: `${link.value}`,
                  register: false
              }}
              >{link.label}</Link>
            </form>
          </div>
        </div>
      </AuthFormWrapper>
    );
}

export default AuthForm;
