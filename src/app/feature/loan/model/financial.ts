import {BaseEntity} from '../../../@core/model/base-entity';

export class Financial extends BaseEntity {
  data?: string;
  uploadExcel: boolean;
  excelData: string;
}
