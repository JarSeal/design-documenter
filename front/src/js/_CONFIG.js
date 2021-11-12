import FourOFour from "./components/contentViews/FourOFour";
import Landing from "./components/contentViews/Landing";
import NewUser from "./components/contentViews/NewUser";
import Universe from "./components/contentViews/Universe";
import TestFormData from "./components/contentViews/TestFormData";
import { getText } from "./helpers/lang";

export const _CONFIG = {
    bbarSize: 64,
    langs: ['en'],
    langFn: getText,
    basePath: '/beacon',
    titlePrefix: '',
    titleSuffix: ' | Beacon',
    apiBaseUrl: 'http://localhost:3001/api',
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
            route: '/uni',
            redirect: '/',
        },
        {
            route: '/uni/:universeId',
            id: 'route-universe',
            source: Universe,
            titleId: 'route_universe',
        },
        {
            route: '/404',
            id: 'route-four-o-four',
            source: FourOFour,
            is404: true,
            titleId: 'route_title_404',
        },
        {
            route: '/newuser',
            id: 'new-user',
            source: NewUser,
            titleId: 'route_title_new_user',
        },
        {
            route: '/testformdata',
            id: 'test-form-data',
            source: TestFormData,
            titleId: 'route_test_form_data',
        },
    ],
};