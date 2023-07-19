import mongoose, { Document, Types } from 'mongoose';

export interface RegionDocument extends Document {
  name: string;
  states: Types.ObjectId[] | StateDocument[];
  tribes: string;
  population: string;
}

export interface StateDocument extends Document {
  name: string;
  regionId: mongoose.Types.ObjectId | RegionDocument;
  area: string;
  population: string;
  lgas: Types.ObjectId[];
}

