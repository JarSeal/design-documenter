import FourOFour from "./components/contentViews/FourOFour";
import Landing from "./components/contentViews/Landing";
import Login from "./components/contentViews/Login";

export const _CONST = {
    bbarSize: 64,
    routes: [
        {
            route: '/404',
            source: FourOFour,
            is404: true,
            title: '404',
        },
        {
            route: '/',
            source: Landing,
            title: 'Home',
        },
        {
            route: '/login',
            source: Login,
            title: 'Login',
        },
    ],
};