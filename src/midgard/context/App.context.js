import React from "react"

//entryPointForGulpStart
export const app = {
  appTitle: "My App",
  modules: [{"id":"products","title":"products"},{"id":"documents","title":"documents"},{"id":"blueprint","title":"blueprint"}]
};
//entryPointForGulpEnd

export const AppContext = React.createContext(app);
