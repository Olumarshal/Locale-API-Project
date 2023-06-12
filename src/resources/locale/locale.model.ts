import { Schema, model } from 'mongoose';
import { RegionDocument,
        StateDocument,
        LGADocument
      } from '@/resources/locale/locale.interface';

const regionSchema = new Schema<RegionDocument>({
    name: { type: String, required: true },
    states: [{ type: Schema.Types.ObjectId, ref: 'State' }],
    tribes: { type: String, required: true },
    population: { type: String, required: true },
  });
  
  const stateSchema = new Schema<StateDocument>({
    name: { type: String, required: true },
    region: { type: Schema.Types.ObjectId, ref: 'Region' },
    area: { type: String, required: true },
    population: { type: String, required: true },
    lgas: [{ type: Schema.Types.ObjectId, ref: 'LGA' }],
  });
  
  const lgaSchema = new Schema<LGADocument>({
    name: { type: String, required: true },
    state: { type: Schema.Types.ObjectId, ref: 'State' },
    area: { type: String, required: true },
    population: { type: String, required: true },
  });
  
  export const Region = model<RegionDocument>('Region', regionSchema);
  export const State = model<StateDocument>('State', stateSchema);
  export const LGA = model<LGADocument>('LGA', lgaSchema);