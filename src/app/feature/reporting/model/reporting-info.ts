import {BaseEntity} from '../../../@core/model/base-entity';
import {Status} from '../../../@core/Status';
import {ReportingInfoLevel} from './reporting-info-level';

export class ReportingInfo extends BaseEntity {
  reportingInfoType: string;
  name: string;
  status: Status;
  reportingInfoLevels: Array<ReportingInfoLevel>;
}
