import {BaseEntity} from './base-entity';
import {Status} from '../Status';

export class ReportingInfoLevel extends BaseEntity {
  code: string;
  description: string;
  status: Status;
  reportingInfoLevels: Array<ReportingInfoLevel>;
}
