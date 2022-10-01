import { Gain } from '../../entities/Gain';

export interface IGainRepository {
  addGain(gain: Gain): Promise<boolean>;
  removeGain(gain: Gain): Promise<boolean>;
  updateGain(gain: Gain): Promise<boolean>;
  findGainById(id: string): Promise<Gain>;
}
