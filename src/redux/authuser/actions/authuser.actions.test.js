import * as actions from '@redux/authuser/actions/authuser.actions'

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
    it('should create an action to logOut', () => {
        const credentials = 'AUTH/LOGOUT';
        const expectedAction = {
            type: actions.LOGOUT,
        }
        expect(actions.logout(credentials)).toEqual(expectedAction)
    })
})

describe('actions', () => {
    it('should create an action to Register', () => {
        const data = 'AUTH/REGISTER';
        const expectedAction = {
            data,
            type: actions.REGISTER,
        }
        expect(actions.register(data)).toEqual(expectedAction)
    })
})

describe('actions', () => {
    it('should create an action to Update User', () => {
        const data = 'AUTH/UPDATE_USER';
        const expectedAction = {
            data,
            type: actions.UPDATE_USER,
        }
        expect(actions.updateUser(data)).toEqual(expectedAction)
    })
})

describe('actions', () => {
    it('should create an action to Update User', () => {
        const data = 'AUTH/INVITE_USER';
        const expectedAction = {
            data,
            type: actions.INVITE,
        }
        expect(actions.invite(data)).toEqual(expectedAction)
    })
})

describe('actions', () => {
    it('should create an action to Update Organization', () => {
        const data = 'AUTH/UPDATE_ORGANIZATION';
        const expectedAction = {
            data,
            type: actions.UPDATE_ORGANIZATION,
        }
        expect(actions.updateOrganization(data)).toEqual(expectedAction)
    })
})