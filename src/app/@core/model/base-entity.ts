export class BaseEntity {
  id?: number;
  createdAt?: Date;
  lastModifiedAt?: Date;
  createdBy?: number;
  modifiedBy?: number;
  version?: number;
}
