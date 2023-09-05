
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.releases.Loading Releases:invocation[0]": { type: "done.invoke.releases.Loading Releases:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.releases.Loading Releases:invocation[0]": { type: "error.platform.releases.Loading Releases:invocation[0]"; data: unknown };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "loadReleases": "done.invoke.releases.Loading Releases:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: "loadReleases";
        };
        eventsCausingActions: {
          "addErrorToCxt": "error.platform.releases.Loading Releases:invocation[0]";
"addReleasesToContext": "done.invoke.releases.Loading Releases:invocation[0]";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          
        };
        eventsCausingServices: {
          "loadReleases": "xstate.init";
        };
        matchesStates: "Loading Failed" | "Loading Releases" | "Releases Loaded";
        tags: never;
      }
  