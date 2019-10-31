import {DocStatus} from './docStatus';
import {OfferLetter} from '../../admin/modal/offerLetter';
import {OfferLetterStage} from './offer-letter-stage';
import {BaseEntity} from '../../../@core/model/base-entity';

export class CustomerOfferLetter extends BaseEntity {
    path: string;
    isOfferLetterIssued: boolean;
    isOfferLetterApproved: boolean;
    docStatus: DocStatus;
    customerLoanId: number;
    offerLetterStage: OfferLetterStage;
    offerLetterStageList: string;
    initialInformation: string;
    supportedInformation: string;
    offerLetter: OfferLetter;
    previousList: Array<any>;
}
