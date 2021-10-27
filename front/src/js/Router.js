import RouteLink from "./components/buttons/RouteLink";

class Router {
    constructor(routes) {
        this.routes = [];
        this.curRoute = '/';
        this.curRouteData = {
            route: '/',
            source: null,
            component: null,
            level: 0,
        };
        this.prevRoute = null;
        this.prevRouteData = null;
        this.initRouter(routes);
    }

    initRouter(routes) {
        // console.log(location.protocol + '//' + location.host + location.pathname);
        this.setRoute();
        if(!routes) {
            this.notFound();
            return;
        }
        let routeFound = false;
        for(let i=0; i<routes.length; i++) {
            routes[i].component = new routes[i].source();
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
    }

    changeRoute(data) {
        console.log('data', data);
        window.history.pushState(data.id, '', data.link);
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
            return;
        }
        this.setRoute();
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