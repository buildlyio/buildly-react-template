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
    const handleItemDeleted = () => {
        return false;
    };

    const action = false;
    return (
      <Crud createAction={action} deleteAction="DELETE_ACTION" itemDeleted={handleItemDeleted}>
          <CrudContext.Consumer>{crud => (
              <AuthFormWrapper className="auth">
                  <div className="auth__card">
                    <div className="auth__card__content">
                      <img className="auth__card__logo" src={logo} />
                      <form className="auth__form" onSubmit={onSubmit}>
                        {children}
                        <Link className="auth__form__link" to={link.value}>{link.label}</Link>
                      </form>
                      <button onClick={() => crud.deleteItem({name: 'andrew'})}/>
                    </div>
                  </div>
              </AuthFormWrapper>
                  )}
        </CrudContext.Consumer>
      </Crud>
    );
}

export default AuthForm;
