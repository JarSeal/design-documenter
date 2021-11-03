import { Logger } from "./utils";

let routerInitiated = false;

const logger = new Logger('LIGHTER.js ROUTE *****');

class Router {
    constructor(routesData, parentId, rcCallback, componentData) {
        // DOC: routesData = {
        //   routes: [], (= see below [Array] [required])
        //   basePath: '', (= basepath of the whole app [String] [optional])
        //   titlePrefix: '', (= page and document title prefix [String] [optional])
        //   titleSuffix: '', (= page and document title suffix [String] [optional])
        //   langFn: function() {}, (= language strings getter functiON [Function] [optional])
        // } [Object] [required]
        // DOC: parentId = id of the element that the Router is attached to [String] [required]
        // DOC: rcCallback = after the route has changed callback function [Function] [required]
        // DOC: componentData = additional component data to be added to all view components [Object] [optional]
        // *****************
        // DOC: routesData.routes = [{
        //   route: '', (= route path [String] [required])
        //   id: '', (= view's component id [String] [required])
        //   source: ComponentClassName, (= component's class [Component] [required])
        //   title: '', (= page and document title without translation [String] [optional])
        //   titleId: '', (= page and document title translation id [requires langFn], overwrites title attribute if set [String] [optional])
        //   is404: false, (= set true if current route is 404 template [Boolean] [required for one route])
        // }]
        if(routerInitiated) {
            logger.error('Router has already been initiated. Only one router per app is allowed');
            throw new Error('Call stack');
        }
        RouterRef = this;
        this.routes = [];
        this.basePath = routesData.basePath || '';
        this.titlePrefix = routesData.titlePrefix || '';
        this.titleSuffix = routesData.titleSuffix || '';
        this.langFn = routesData.langFn;
        this.curRoute = this.basePath + '/';
        this.rcCallback = rcCallback;
        this.curRouteData = {
            route: this.basePath + '/',
            source: null,
            component: null,
            level: 0,
        };
        this.prevRoute = null;
        this.prevRouteData = null;
        if(!componentData) componentData = {};
        this.initRouter(routesData.routes, parentId, componentData);
    }

    initRouter(routes, parentId, componentData) {
        this.setRoute();
        let changeUrlPath = false;
        if(this.curRoute.length < this.basePath.length) {
            this.curRoute = this.basePath + '/';
            changeUrlPath = true;
        }
        if(!routes) {
            this.notFound();
            return;
        }
        let routeFound = false;
        for(let i=0; i<routes.length; i++) {
            if(!routes[i].id) {
                logger.error(`Route is missing the id attribute.`);
                throw new Error('Call stack');
            }
            if(!routes[i].route) {
                logger.error(`Route '${routes[i].id}' is missing the route attribute.`);
                throw new Error('Call stack');
            }
            routes[i].route = this.basePath + routes[i].route;
            if(this.langFn) {
                if(routes[i].titleId) {
                    routes[i].title = this.langFn(routes[i].titleId)
                } else {
                    logger.warn(`Router has a langFn defined, but route '${routes[i].id}' is missing the titleId.`);
                }
            }
            if(!routes[i].title) {
                logger.warn(`Route '${routes[i].id}' is missing the title. Setting id as title.`);
                routes[i].title = routes[i].id;
            }
            routes[i].component = new routes[i].source({
                ...componentData,
                id: routes[i].id,
                parentId: parentId,
                title: routes[i].title,
                template: routes[i].template,
                extraRouteData: routes[i].extraRouteData,
            });
            this.routes.push(routes[i]);
            if(routes[i].route === this.curRoute || routes[i].route === this.curRoute + '/') {
                routeFound = true;
                this.curRouteData = routes[i];
                document.title = this._createPageTitle(routes[i].title);
            }
        }
        if(!routeFound) {
            this.notFound();
        }
        window.onpopstate = this.routeChangeListener;
        if(changeUrlPath) {
            const routeState = this._createRouteState(this.curRoute);
            window.history.pushState(routeState, '', this.curRoute);
        }
        routerInitiated = true;
    }

    routeChangeListener = (e) => {
        this.setRoute();
        this.changeRoute(this.curRoute, true, true);
    }

    _createPageTitle(title) {
        return this.titlePrefix + title + this.titleSuffix;
    }

    _createRouteState(route) {
        for(let i=0; i<this.routes.length; i++) {
            if(this.routes[i].route === route || this.routes[i].route === route + '/') {
                return {
                    route: this.routes[i].route,
                    title: this._createPageTitle(this.routes[i].title),
                };
            }
        }
    }

    changeRoute(route, forceUpdate, ignoreBasePath) {
        let basePath = this.basePath;
        if(ignoreBasePath) basePath = '';
        route = basePath + route;
        if(route === this.curRoute && !forceUpdate) return;
        const routeState = this._createRouteState(route);
        window.history.pushState(routeState, '', route);
        this.curRouteData.component.discard();
        this.setRoute();
        let routeFound = false;
        for(let i=0; i<this.routes.length; i++) {
            if(this.routes[i].route === route || this.routes[i].route === route + '/') {
                routeFound = true;
                this.curRouteData = this.routes[i];
                document.title = this._createPageTitle(this.routes[i].title);
                break;
            }
        }
        if(!routeFound) {
            this.notFound();
        }
        this.rcCallback(this.curRoute);
    }

    getRoute() {
        return this.curRoute;
    }

    getRouteData() {
        return { ...this.curRouteData, prevRouteData: this.prevRouteData };
    }

    setRoute() {
        let path = location.pathname;
        if(!path) {
            this.curRoute = this.basePath + '/';
        } else {
            // Remove last slash if found
            if(path.length > 1 && path.substring(path.length - 1, path.length) === '/') {
                path = path.substring(0, path.length - 1);
            }
            this.curRoute = path;
        }
    }

    addRoute(routeData) {
        routeData.route = this.basePath + routeData.route;
        this.routes.push(routeData);
        if(routeData.route === this.curRoute) {
            this.curRouteData = routeData;
        }
    }

    notFound() {
        let template;
        for(let i=0; i<this.routes.length; i++) {
            if(this.routes[i].is404) {
                template = this.routes[i];
            }
        }
        if(!template) {
            logger.error('Could not find 404 template.')
            throw new Error('Call stack');
        }
        this.curRouteData = template;
        document.title = this._createPageTitle(template.title);
    }

    draw() {
        this.curRouteData.component.draw();
        if(this.prevRouteData) this.prevRouteData.component.discard();
    }
}

export default Router;

export let RouterRef = null;