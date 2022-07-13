import {BaseEntity} from '../../../@core/model/base-entity';

export class Financial extends BaseEntity {
  data?: string;
  sensitive: string;
  historicalProjected: string;
}
