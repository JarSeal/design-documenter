import FourOFour from "./components/contentViews/FourOFour";
import Landing from "./components/contentViews/Landing";
import Login from "./components/contentViews/Login";

export const _CONFIG = {
    bbarSize: 64,
    apiBaseUrl: 'http://localhost:3001/api',
    routes: [
        {
            route: '/',
            id: 'route-landing',
            source: Landing,
            title: 'Home',
        },
        {
            route: '/404',
            id: 'route-four-o-four',
            source: FourOFour,
            is404: true,
            title: '404',
        },
        {
            route: '/login',
            id: 'route-login',
            source: Login,
            title: 'Login',
        },
    ],
};