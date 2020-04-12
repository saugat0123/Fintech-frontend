import {BaseEntity} from './base-entity';
import {NotificationMasterType} from './enum/NotificationMasterType';

export class NotificationMaster extends BaseEntity {
  notificationKey: NotificationMasterType;
  value: number;
}
