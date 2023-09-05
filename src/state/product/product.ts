import { assign, createMachine } from 'xstate';

export const productMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7CBXAxgFwDoAFDbfWAAgBl0BDCASwDsoBiCdJsA5gN3QDW3NJlyESo8tTqMWCPuhy08DTgG0ADAF1NWxCnSwGKzvpAAPRAFYAzAQCcAFgCMjjQDYATFYA0IAJ6IALTuVgSeNo42AOxWAL5xfiJk4qRilDT0zGxgqBioBMgANsoAZuioALaFafjEtXgZMtnyTPxKJky6umbIhsaqTGaWCEHengQAHJPu0c6TsX6Bo6HhkTHxCX5MmHC9Db39ncPBNs529hoRUYsBwZ727g7TnpPO3lsgyWL1ko3SWRYhyMxyQFmC9miBEc7g09g2S3ucOhLzeH0SXwavxSTXokGBA1MYJGVkm4U8nlCXl8dwQMII0Rsk1e702SSxEhxANkUAoADFaAwiviwX0QYMTqNKWFLtcEbSbPYphoYQtNgkgA */
  id: 'product',
  tsTypes: {} as import("./product.typegen").Typegen0,
  context: {
    products: [] as any,
    error: undefined as string | undefined, 

  },
  schema: {
    services: {} as {
        loadProducts: {data: any}
    }
  },
  initial: "Products Loading",
  states: {
    "Products Loading": {
      invoke: {
        src: 'loadProducts',
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

    "Products Loaded": {},
    "Products Loading Failed": {}
  }
},
{
    actions: {
        addProductsToCxt: assign((cxt, event) =>  ({products: event.data})),
        addErrorToCxt: assign((cxt, event) => ({error: (event.data as Error).message}))
    }
});
