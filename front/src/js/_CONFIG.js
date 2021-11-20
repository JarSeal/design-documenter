import FourOFour from "./components/contentViews/FourOFour";
import FourOOne from "./components/contentViews/FourOOne";
import Landing from "./components/contentViews/Landing";
import Login from "./components/contentViews/Login";
import Logout from "./components/contentViews/Logout";
import NewUser from "./components/contentViews/NewUser";
import Settings from "./components/contentViews/Settings";
import Universe from "./components/contentViews/Universe";
import { getText } from "./helpers/lang";
import { checkRouteAccess } from "./helpers/storage";
const conf = require('./shared').CONFIG.UI;

const _conf = {
    langFn: getText,
    lsKeyPrefix: 'bjs_',
    ssKeyPrefix: 'bjs_',
    routes: [
        {
            route: '/',
            id: 'route-landing',
            source: Landing,
            titleId: 'route_title_landing',
            beforeDraw: async (routerData) => {
                return await checkRouteAccess(routerData);
            },
        },
        {
            route: '/login',
            id: 'route-login',
            source: Login,
            titleId: 'route_title_login',
        },
        {
            route: '/uni',
            redirect: '/',
        },
        {
            route: '/uni/:universeId',
            id: 'route-universe',
            source: Universe,
            titleId: 'route_universe',
            beforeDraw: async (routerData) => {
                return await checkRouteAccess(routerData);
            },
        },
        {
            route: '/newuser',
            id: 'route-new-user',
            source: NewUser,
            titleId: 'route_title_new_user',
            beforeDraw: async (routerData) => {
                return await checkRouteAccess(routerData);
            },
        },
        {
            route: '/settings',
            redirect: '/settings/default',
        },
        {
            route: '/settings/:tab',
            id: 'route-settings',
            source: Settings,
            titleId: 'route_title_settings',
            beforeDraw: async (routerData) => {
                return await checkRouteAccess(routerData);
            },
        },
        {
            route: '/logout',
            id: 'route-logout',
            titleId: 'route_title_login',
            source: Logout,
        },
        {
            route: '/404/:type/:data',
            id: 'route-four-o-four',
            source: FourOFour,
            is404: true,
            titleId: 'route_title_404',
        },
        {
            route: '/401',
            id: 'route-four-o-one',
            source: FourOOne,
            titleId: 'route_title_401',
        },
    ],
};

export const _CONFIG = Object.assign({}, _conf, conf);