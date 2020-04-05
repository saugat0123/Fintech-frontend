import {BaseEntity} from '../../../@core/model/base-entity';
import {Status} from '../../../@core/Status';

export class ReportingInfoLevel extends BaseEntity {
  code: string;
  description: string;
  status: Status;
  reportingInfoLevels: Array<ReportingInfoLevel>;
}
