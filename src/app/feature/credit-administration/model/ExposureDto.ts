import {BaseEntity} from '../../../@core/model/base-entity';
import {UploadDto} from './uploadDto';

export class ExposureDto extends BaseEntity {
    historyData: string;
    exposureComment: string;
    uploadDto: Array<UploadDto>;
}