import React from "react"

//entryPointForGulpStart
export const app = {
  appTitle: "My App",
  modules: [{"id":"blueprint","title":"Blueprint"}]
};
//entryPointForGulpEnd

export const AppContext = React.createContext(app);
