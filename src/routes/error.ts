import { Response, Request, Router, NextFunction } from 'express';
import { BaseRoute } from "./route";

export class ErrorRoute extends BaseRoute {
    constructor() {
        super();
    }

    public static create(router: Router) {
        console.log("[ErrorRoute::create]");
        router.get('/error', (req: Request, res: Response, next: NextFunction) => {
            new ErrorRoute().index(req, res, next);
        });

    }
    public index(req: Request, res: Response, next: NextFunction) {
        this.title = "Error | Template";
        
        let options: Object = {
            "message": "Error 404"
        }
        this.render(req, res, "error", options);
    }
}