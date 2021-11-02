import FourOFour from "./components/contentViews/FourOFour";
import Landing from "./components/contentViews/Landing";

export const _CONFIG = {
    bbarSize: 64,
    langs: ['en'],
    basePath: '/beacon',
    apiBaseUrl: 'http://localhost:3001/api',
    lsKeyPrefix: 'bjs_',
    ssKeyPrefix: 'bjs_',
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
    ],
};