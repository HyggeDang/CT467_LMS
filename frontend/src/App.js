import React from "react";
import Router from "./router/Router";

const App = (props) => {
    return (
        <React.Fragment>
            <React.Suspense>
                <Router />
            </React.Suspense>
        </React.Fragment>
    );
};

export default App;
