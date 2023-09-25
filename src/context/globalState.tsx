import React, {createContext, PropsWithChildren} from 'react';

import {useInterpret} from '@xstate/react';
import {InterpreterFrom} from 'xstate';

import {productMachine} from '../state/product/product';
import {releaseMachine} from '../state/release/release';

export const GlobalStateContext = createContext(
    {
        productMachineService: {} as InterpreterFrom<typeof productMachine>,
        releaseMachineService: {} as InterpreterFrom<typeof releaseMachine>,
        organization: null as any
    }
);

export const GlobalStateProvider = ({children}: PropsWithChildren) => {
    const currentUser = localStorage.getItem('currentUser')
    let organization: any = null;
    if (currentUser) {
        organization = JSON.parse(currentUser).organization;
    }

    // instantiate productMachine service
    const productMachineService = useInterpret(
        productMachine,
        {
            context: {
                products: [],
                error: undefined,
                organization_uuid: organization?.organization_uuid,
                selectedProduct: null,
            },
        },
    );

    // instantiate releaseMachine Service
    const releaseMachineService = useInterpret(
        releaseMachine,
        {
            context: {
                releases: [],
                error: undefined,
            }
        }
    );


    return (
        <GlobalStateContext.Provider value={{productMachineService, releaseMachineService, organization}}>
            {children}
        </GlobalStateContext.Provider>
    );
};
