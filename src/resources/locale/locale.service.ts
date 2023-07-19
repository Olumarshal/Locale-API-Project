import { Types } from 'mongoose';
import { Region, State } from '@/resources/locale/locale.model';
import {
    RegionDocument,
    StateDocument,
} from '@/resources/locale/locale.interface';

class LocaleService {
    public async searchRegions(query: string): Promise<RegionDocument[]> {
        try {
            const regions = await Region.find({
                name: { $regex: new RegExp(query, 'i') },
            });
            return regions;
        } catch (error) {
            throw new Error('Failed to search regions');
        }
    }

    public async searchStates(query: string): Promise<StateDocument[]> {
        try {
          const states = await State.find({ name: { $regex: new RegExp(query, 'i') } })
          return states;
        } catch (error) {
          throw new Error('Failed to search states');
        }
      }
      
}

export default LocaleService;
