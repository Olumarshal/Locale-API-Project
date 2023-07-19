import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import localeQuerySchema from '@/resources/locale/locale.validation';
import LocaleService from '@/resources/locale/locale.service';
import User from '@/resources/user/user.interface';
import authenticated from '@/middleware/authenticated.middleware';
import { Region, State} from '@/resources/locale/locale.model';
import {
    RegionDocument,
    StateDocument,
} from '@/resources/locale/locale.interface';

import RedisCache from '@/utils/cache';

interface AuthenticatedRequest extends Request {
    user: User;
}

class LocaleController implements Controller {
    public path = '/locale';
    public router = Router();
    private localeService = new LocaleService();
    private cache = new RedisCache();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        const authenticatedMiddlewareWrapper = (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<Response | void> => {
            return authenticated(
                req as AuthenticatedRequest,
                res,
                next as NextFunction
            );
        };

        this.router.get(
            `${this.path}/regions`,
            authenticatedMiddlewareWrapper,
            validationMiddleware(localeQuerySchema),
            this.searchRegions
        );
        this.router.get(
            `${this.path}/states`,
            authenticatedMiddlewareWrapper,
            validationMiddleware(localeQuerySchema),
            this.searchStates
        );
    }

    private searchRegions = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const authenticatedReq = req as AuthenticatedRequest;
        const query: string = authenticatedReq.query.query?.toString() ?? '';

        try {
            const cachedData = await this.cache.get(query);
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }

            const regions: RegionDocument[] =
                await this.localeService.searchRegions(query);
            const response: any = { regions };

            await this.cache.set(query, JSON.stringify({ response }), 60);
            // await this.cache.set(query, JSON.stringify({ response }), 3600);
            return res.json({ response });
        } catch (error: any) {
            next(new HttpException(500, error.message));
        }
    };

    private searchStates = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const authenticatedReq = req as AuthenticatedRequest;
        const query: string = authenticatedReq.query.query?.toString() ?? '';

        try {
            const cachedData = await this.cache.get(query);
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }

            const states: StateDocument[] =
                await this.localeService.searchStates(query);
            const response: any = { states };
            response.states = await Promise.all(
                states.map(async (state) => {
                    const region: RegionDocument | null = await Region.findById(
                        state.regionId
                    );
                    return {
                        ...state.toObject(),
                        region: region?.name, // Include the region name
                    };
                })
            );

            await this.cache.set(query, JSON.stringify({ response }), 3600);
            return res.json({ response });
        } catch (error: any) {
            next(new HttpException(500, error.message));
        }
    };

   
}

export default LocaleController;
