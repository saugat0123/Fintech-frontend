export class BaseRevisionEntity<T> {
  entity: T;
  revisionDate: Date;
  revisionType: any;
}
