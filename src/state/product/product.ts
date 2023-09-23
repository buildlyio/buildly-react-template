import {assign, createMachine} from 'xstate';

import {loadProducts} from './actions';

export const productMachine = createMachine({
        id: 'product',
        tsTypes: {} as import("./product.typegen").Typegen0,
        context: {
            products: [] as any,
            error: undefined as string | undefined,
            organization_uuid: null as any,
            selectedProduct: null as any

        },
        initial: "Products Loading",
        states: {
            "Products Loading": {
                invoke: {
                    src: loadProducts,
                    onDone: [
                        {
                            target: 'Products Loaded',
                            actions: 'addProductsToCxt'
                        }
                    ],
                    onError: [
                        {
                            target: 'Products Loading Failed',
                            actions: 'addErrorToCxt'
                        }
                    ]
                }
            },

            "Products Loaded": {
                on: {
                    SelectProduct: {actions: "setSelectedProduct"}
                }
            },
            "Products Loading Failed": {}
        }
    },
    {
        actions: {
            addProductsToCxt: assign(
                (cxt, event) => {
                    const data: any = event.data
                    return {products: data, selectedProduct: data[0]}
                }
            ),
            addErrorToCxt: assign((cxt, event) => (
                {error: (event.data as Error).message})
            ),
            setSelectedProduct: assign({
                selectedProduct: (cxt, event) => {
                    const data: any = event;
                    return cxt.products.find((item: any) => item.product_uuid === data.product_uuid)
                }
            })
        }
    });
