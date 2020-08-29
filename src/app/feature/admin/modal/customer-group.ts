import {BaseEntity} from '../../../@core/model/base-entity';
import {Status} from '../../../@core/Status';

export class CustomerGroup extends BaseEntity {
  groupCode: string;
  groupLimit: number;
  status: Status;
}
