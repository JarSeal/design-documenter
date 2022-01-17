const USER = {
    username: {
        minLength: 5,
    },
    name: {
        minLength: 0,
        required: false,
    },
    email: {
        required: true,
        // unique: true,
    },
    password: {
        minLength: 6,
    }
};

const UI = {
    langs: ['en'],
    apiBaseUrl: 'http://localhost:3001',
    basePath: '/beacon',
    titlePrefix: '',
    titleSuffix: ' | Beacon',
    bbarSize: 64,
};

const ROUTE_ACCESS = [
    {
        path: '/',
        formId: 'route-landing',
        useRightsLevel: 2,
        editorRightsLevel: 8,
    },
    {
        path: '/login',
        formId: 'route-login',
        useRightsLevel: 0,
        editorRightsLevel: 8,
    },
    {
        path: '/uni/:universeId',
        formId: 'route-universe',
        useRightsLevel: 2,
        editorRightsLevel: 8,
    },
    {
        path: '/newuser',
        formId: 'route-new-user',
        useRightsLevel: 0,
        editorRightsLevel: 8,
    },
    {
        path: '/settings',
        formId: 'route-settings',
        useRightsLevel: 2,
        editorRightsLevel: 8,
    },
    {
        path: '/404',
        formId: 'route-four-o-four',
        useRightsLevel: 0,
        editorRightsLevel: 8,
        locked: true,
    },
    {
        path: '/401',
        formId: 'route-four-o-one',
        useRightsLevel: 0,
        editorRightsLevel: 8,
        locked: true,
    },
];

const USER_LEVELS = [
    {
        userLevel: 9,
        labelId: 'user_level_9_super_admin',
    },
    {
        userLevel: 8,
        labelId: 'user_level_8_administrator',
    },
    {
        userLevel: 2,
        labelId: 'user_level_2_beacon_user',
    },
    {
        userLevel: 1,
        labelId: 'user_level_1_loggedin_user',
    },
    {
        userLevel: 0,
        labelId: 'user_level_0_anonymous_user',
    },
];

module.exports = {
    USER,
    UI,
    ROUTE_ACCESS,
    USER_LEVELS,
};