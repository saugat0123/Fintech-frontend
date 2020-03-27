import {BaseEntity} from './base-entity';
import {Status} from '../Status';

export class ReportingInfo extends BaseEntity {
  name: string;
  status: Status;
}
