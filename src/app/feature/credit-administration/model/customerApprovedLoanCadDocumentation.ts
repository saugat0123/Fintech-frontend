import {BaseEntity} from '../../../@core/model/base-entity';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {LoanDataHolder} from '../../loan/model/loanData';
import {Stage} from '../../loan/model/stage';
import {CadFile} from './CadFile';
import {OfferDocument} from './OfferDocument';
import {CadDocStatus} from './CadDocStatus';
import {Exposure} from './Exposure';

export class CustomerApprovedLoanCadDocumentation extends BaseEntity {

    loanHolder: CustomerInfoData;
    assignedLoan: Array<LoanDataHolder>;
    cadCurrentStage: any;
    cadFileList: Array<CadFile>;
    offerDocumentList: Array<OfferDocument>;
    cadStageList: string;
    previousList: Array<any>;
    docStatus: CadDocStatus;
    feesAndCommission: string;
    exposure: Exposure;


}
