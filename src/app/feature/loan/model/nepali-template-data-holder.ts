import {NepaliTemplateType} from '../../admin/modal/nepali-template-type.enum';

/**
 * @description This is a model class to hold the data of Nepali templates.
 */
export class NepaliTemplateDataHolder {
  id: number;
  type: NepaliTemplateType;
  data: string;
}
