import FourOFour from "./components/contentViews/FourOFour";
import FourOOne from "./components/contentViews/FourOOne";
import Landing from "./components/contentViews/Landing";
import Login from "./components/contentViews/Login";
import NewUser from "./components/contentViews/NewUser";
import Universe from "./components/contentViews/Universe";
import { getText } from "./helpers/lang";
import { checkCredentials } from "./helpers/storage";
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
        },
        {
            route: '/login',
            id: 'route-login',
            source: Login,
            titleId: 'route_title_login',
        },
        {
            route: '/to/:path',
            id: 'route-landing',
            source: Landing,
            titleId: 'route_title_landing',
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
            // beforeDraw: async (routerData) => {
            //     const check = await checkCredentials({ userLevel: 2 }, routerData.curRoute);
            //     return check;
            // },
        },
        {
            route: '/newuser',
            id: 'new-user',
            source: NewUser,
            titleId: 'route_title_new_user',
        },
        {
            route: '/404',
            id: 'route-four-o-four',
            source: FourOFour,
            is404: true,
            titleId: 'route_title_404',
        },
        {
            route: '/401',
            id: 'route-four-o-one',
            source: FourOOne,
            is404: true,
            titleId: 'route_title_401',
        },
    ],
};

export const _CONFIG = Object.assign({}, _conf, conf);