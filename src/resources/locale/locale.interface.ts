import { Document, Types } from 'mongoose';

export interface RegionDocument extends Document {
  name: string;
  states: Types.ObjectId[] | StateDocument[];
  tribes: string;
  population: string;
}

export interface StateDocument extends Document {
  name: string;
  region: Types.ObjectId | RegionDocument;
  area: string;
  population: string;
  lgas: Types.ObjectId[] | LGADocument[];
}

export interface LGADocument extends Document {
  name: string;
  state: Types.ObjectId | StateDocument;
  area: string;
  population: string;
}
