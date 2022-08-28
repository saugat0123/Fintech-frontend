import {BaseEntity} from '../../../@core/model/base-entity';

export class ReviewDate extends BaseEntity {
    data: string = null;
    lastReviewDate: Date  = null;
    nextReviewDate: Date  = null;
    nextReviewDateChecked: boolean  = null;
    lastReviewDateChecked: boolean  = null;
}
