
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.releases.Entry.Loading:invocation[0]": { type: "done.invoke.releases.Entry.Loading:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.releases.Submitting.Updating:invocation[0]": { type: "done.invoke.releases.Submitting.Updating:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.releases.Entry.Loading:invocation[0]": { type: "error.platform.releases.Entry.Loading:invocation[0]"; data: unknown };
"error.platform.releases.Submitting.Updating:invocation[0]": { type: "error.platform.releases.Submitting.Updating:invocation[0]"; data: unknown };
"xstate.after(500)#releases.Entry.Loaded": { type: "xstate.after(500)#releases.Entry.Loaded" };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: "release_uuid";
          services: never;
        };
        eventsCausingActions: {
          "addErrorToCxt": "error.platform.releases.Entry.Loading:invocation[0]" | "error.platform.releases.Submitting.Updating:invocation[0]";
"addReleasesToContext": "done.invoke.releases.Entry.Loading:invocation[0]";
"addSingleReleaseToCxt": "done.invoke.releases.Submitting.Updating:invocation[0]";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "release_uuid": "Submit";
        };
        eventsCausingServices: {
          
        };
        matchesStates: "Entry" | "Entry.FormData" | "Entry.Idle" | "Entry.LoadFailed" | "Entry.Loaded" | "Entry.Loading" | "SubmitFailed" | "Submitted" | "Submitting" | "Submitting.Creating" | "Submitting.Updating" | { "Entry"?: "FormData" | "Idle" | "LoadFailed" | "Loaded" | "Loading";
"Submitting"?: "Creating" | "Updating"; };
        tags: never;
      }
  