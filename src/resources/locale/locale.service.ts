import { Types } from 'mongoose';
import { Region, State, LGA } from '@/resources/locale/locale.model';
import {
    RegionDocument,
    StateDocument,
    LGADocument,
} from '@/resources/locale/locale.interface';

class LocaleService {
    // Get Location
    public async getAllRegionData(): // type: string, // 'region', 'state', or 'lga'
    // name: string,
    // metadata: Mixed,
    // parentId?: Mixed // Only required for 'state' and 'lga' types
    Promise<RegionDocument[]> {
        try {
            const regions = await Region.find();
            return regions;
        } catch (error) {
            throw new Error('Failed to fetch region data');
        }
    }

    public async getAllStatesData(): Promise<StateDocument[]> {
        try {
            const states = await State.find();
            return states;
        } catch (error) {
            throw new Error('Failed to fetch states data');
        }
    }

    public async getAllLGAsData(): Promise<LGADocument[]> {
        try {
            const lgas = await LGA.find();
            return lgas;
        } catch (error) {
            throw new Error('Failed to fetch LGAs data');
        }
    }

    public async searchByRegion(query: string): Promise<RegionDocument | null> {
        try {
            const region = await Region.findOne({ name: query }).populate(
                'states'
            );
            return region;
        } catch (error) {
            throw new Error('Failed to search by region');
        }
    }

    public async searchByState(query: string): Promise<StateDocument | null> {
        try {
            const state = await State.findOne({ name: query }).populate('lgas');
            return state;
        } catch (error) {
            throw new Error('Failed to search by state');
        }
    }

    public async searchByLGA(query: string): Promise<LGADocument | null> {
        try {
            const lga = await LGA.findOne({ name: query });
            return lga;
        } catch (error) {
            throw new Error('Failed to search by LGA');
        }
    }
}

export default LocaleService;
