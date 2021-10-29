let routerInitiated = false;

class Router {
    constructor(routes, parentId, rcCallback, componentData) {
        if(routerInitiated) {
            console.error('Router has already been initiated. Only one router per app is allowed');
            return;
        }
        RouterRef = this;
        this.routes = [];
        this.curRoute = '/';
        this.rcCallback = rcCallback;
        this.curRouteData = {
            route: '/',
            source: null,
            component: null,
            level: 0,
        };
        this.prevRoute = null;
        this.prevRouteData = null;
        if(!componentData) componentData = {};
        this.initRouter(routes, parentId, componentData);
    }

    initRouter(routes, parentId, componentData) {
        this.setRoute();
        if(!routes) {
            this.notFound();
            return;
        }
        let routeFound = false;
        for(let i=0; i<routes.length; i++) {
            routes[i].component = new routes[i].source({
                ...componentData,
                id: routes[i].id,
                parentId: parentId,
            });
            this.routes.push(routes[i]);
            if(routes[i].route === this.curRoute) {
                routeFound = true;
                this.curRouteData = routes[i];
                break;
            }
        }
        if(!routeFound) {
            this.notFound();
        }
        window.onpopstate = this.routeChangeListener;
        routerInitiated = true;
    }

    routeChangeListener = (e) => {
        this.setRoute();
        this.changeRoute(this.curRoute);
    }

    _createRouteState(route) {
        for(let i=0; i<this.routes.length; i++) {
            if(this.routes[i].route === route) {
                return {
                    route: this.routes[i].route,
                    title: this.routes[i].title,
                };
            }
        }
    }

    changeRoute(route) {
        const routeState = this._createRouteState(route);
        window.history.pushState(routeState, '', route);
        this.curRouteData.component.discard();
        this.setRoute();
        let routeFound = false;
        for(let i=0; i<this.routes.length; i++) {
            if(this.routes[i].route === this.curRoute) {
                routeFound = true;
                this.curRouteData = this.routes[i];
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
            this.curRoute = '/';
        } else {
            // Remove last slash if found
            if(path.length > 1 && path.substring(path.length - 1, path.length) === '/') {
                path = path.substring(0, path.length - 1);
            }
            this.curRoute = path;
        }
    }

    addRoute(routeData) {
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
            console.error('Could not find 404 template.')
            return;
        }
        this.curRouteData = template;
    }
}

export default Router;

export let RouterRef = null;