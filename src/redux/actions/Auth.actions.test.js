import * as actions from 'redux/actions/Auth.actions'

describe('actions', () => {
    it('should create an action to login', () => {
        const credentials = 'AUTH/LOGIN';
        const expectedAction = {
            type: actions.LOGIN,
            credentials
        }
        expect(actions.login(credentials)).toEqual(expectedAction)
    })
})

describe('actions', () => {
    it('should create an action to logoout', () => {
        const credentials = 'AUTH/LOGOUT';
        const expectedAction = {
            type: actions.LOGOUT,
        }
        expect(actions.logout(credentials)).toEqual(expectedAction)
    })
})

describe('actions', () => {
    it('should create an action to logoout', () => {
        const data = 'AUTH/REGISTER';
        const expectedAction = {
            data,
            type: actions.REGISTER,
        }
        expect(actions.register(data)).toEqual(expectedAction)
    })
})