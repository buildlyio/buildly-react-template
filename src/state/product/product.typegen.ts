
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.productMachine.Products Loading:invocation[0]": { type: "done.invoke.productMachine.Products Loading:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.productMachine.Products Loading:invocation[0]": { type: "error.platform.productMachine.Products Loading:invocation[0]"; data: unknown };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "addErrorToCxt": "error.platform.productMachine.Products Loading:invocation[0]";
"addProductsToCxt": "done.invoke.productMachine.Products Loading:invocation[0]";
"setSelectedProduct": "SelectProduct";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          
        };
        eventsCausingServices: {
          
        };
        matchesStates: "Products Loaded" | "Products Loading" | "Products Loading Failed";
        tags: never;
      }
  