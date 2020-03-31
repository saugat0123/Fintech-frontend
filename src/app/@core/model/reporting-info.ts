import {BaseEntity} from './base-entity';
import {Status} from '../Status';
import {ReportingInfoLevel} from './reporting-info-level';

export class ReportingInfo extends BaseEntity {
  name: string;
  status: Status;
  reportingInfoLevels: Array<ReportingInfoLevel>;
}
