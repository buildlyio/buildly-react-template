
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.product.Products Loading:invocation[0]": { type: "done.invoke.product.Products Loading:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.product.Products Loading:invocation[0]": { type: "error.platform.product.Products Loading:invocation[0]"; data: unknown };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "loadProducts": "done.invoke.product.Products Loading:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: "loadProducts";
        };
        eventsCausingActions: {
          "addErrorToCxt": "error.platform.product.Products Loading:invocation[0]";
"addProductsToCxt": "done.invoke.product.Products Loading:invocation[0]";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          
        };
        eventsCausingServices: {
          "loadProducts": "xstate.init";
        };
        matchesStates: "Products Loaded" | "Products Loading" | "Products Loading Failed";
        tags: never;
      }
  