import { createBrowserRouter } from "react-router-dom";
import App, { loader } from "./App.tsx";
import {
    checkedInRouteName,
    CheckedInView,
    ErrorView,
    joinWaitlistRouteName,
    JoinWaitlistView,
    waitingRouteName,
    WaitingView,
} from "@views/index.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorView />,
        loader,
        children: [
            {
                path: joinWaitlistRouteName.slice(1),
                element: <JoinWaitlistView />,
            },
            {
                path: waitingRouteName.slice(1),
                element: <WaitingView />,
            },
            {
                path: checkedInRouteName.slice(1),
                element: <CheckedInView />,
            },
        ],
    },
]);

export default router;
