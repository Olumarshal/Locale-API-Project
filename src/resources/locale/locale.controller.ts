import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import localeQuerySchema from '@/resources/locale/locale.validation';
import LocaleService from '@/resources/locale/locale.service';
import authenticated from '@/middleware/authenticated.middleware';
import {
    RegionDocument,
    StateDocument,
    LGADocument,
} from '@/resources/locale/locale.interface';

import RedisCache from '@/utils/cache';

class LocaleController implements Controller {
    public path = '/locale';
    public router = Router();
    private localeService = new LocaleService();
    private cache = new RedisCache();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.get(
            `${this.path}/search`,
            // authenticated,
            validationMiddleware(localeQuerySchema),
            this.getLocationsData
        );
    }

    private getLocationsData = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const query: string = req.query.query?.toString() ?? '';

        try {
            // Check if the data exists in cache
            const cachedData = await this.cache.get(query);
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }

            // Fetch location data from the database using the localeService
            const regions: RegionDocument[] =
                await this.localeService.getAllRegionData();
            const states: StateDocument[] =
                await this.localeService.getAllStatesData();
            const lgas: LGADocument[] =
                await this.localeService.getAllLGAsData();
            const region: RegionDocument | null =
                await this.localeService.searchByRegion(query);
            const state: StateDocument | null =
                await this.localeService.searchByState(query);
            const lga: LGADocument | null =
                await this.localeService.searchByLGA(query);

            // Cache the data
            await this.cache.set(
                query,
                JSON.stringify({ regions, states, lgas, region, state, lga }),
                3600
            ); // Set a TTL of 1 hour (3600 seconds)

            // Return the fetched data
            return res.json({ regions, states, lgas, region, state, lga });
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };
}

export default LocaleController;
