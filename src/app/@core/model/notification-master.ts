import {BaseEntity} from './base-entity';
import {NotificationMasterType} from './enum/NotificationMasterType';
import {Status} from '../Status';

export class NotificationMaster extends BaseEntity {
  notificationKey: NotificationMasterType;
  value: number;
  status: Status;
}
