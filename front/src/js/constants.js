import FourOFour from "./components/contentViews/FourOFour";
import Landing from "./components/contentViews/Landing";

export const _CONST = {
    bbarSize: 64,
    routes: [
        {
            route: '/404',
            source: FourOFour,
            is404: true,
        },
        {
            route: '/',
            source: Landing,
        },
    ],
};