import {DocStatus} from './docStatus';
import {OfferLetterStage} from './offer-letter-stage';
import {BaseEntity} from '../../../@core/model/base-entity';
import {LoanDataHolder} from './loanData';
import {CustomerOfferLetterPath} from './customer-offer-letter-path';

export class CustomerOfferLetter extends BaseEntity {
    customerLoan: LoanDataHolder;
    customerOfferLetterPath: Array<CustomerOfferLetterPath>;
    docStatus: DocStatus;
    isOfferLetterApproved: boolean;
    isOfferLetterIssued: boolean;
    new: boolean;
    offerLetterStage: OfferLetterStage;
    offerLetterStageList: string;
    previousList: any;
}
