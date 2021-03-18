import {BaseEntity} from '../../../@core/model/base-entity';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {LoanDataHolder} from '../../loan/model/loanData';
import {CadFile} from './CadFile';
import {OfferDocument} from './OfferDocument';
import {CadDocStatus} from './CadDocStatus';
import {Exposure} from './Exposure';
import {CadStage} from './cadStage';
import {AdditionalDocument} from './AdditionalDocument';

export class CustomerApprovedLoanCadDocumentation extends BaseEntity {

    loanHolder: CustomerInfoData;
    assignedLoan: Array<LoanDataHolder>;
    cadCurrentStage: CadStage;
    cadFileList: Array<CadFile>;
    offerDocumentList: Array<OfferDocument>;
    cadStageList: string;
    previousList: Array<any>;
    docStatus: CadDocStatus;
    feesAndCommission: string;
    exposure: Exposure;
    data: any;
    disbursementComment: string;
    additionalDocumentList: Array<AdditionalDocument>;
    nepData: any;


}
