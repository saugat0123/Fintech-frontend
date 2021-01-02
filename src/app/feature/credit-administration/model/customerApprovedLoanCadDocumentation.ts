import {BaseEntity} from '../../../@core/model/base-entity';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {LoanDataHolder} from '../../loan/model/loanData';
import {Stage} from '../../loan/model/stage';
import {CadFile} from './CadFile';
import {OfferDocument} from './OfferDocument';
import {CadDocStatus} from './CadDocStatus';

export class CustomerApprovedLoanCadDocumentation extends BaseEntity {

    loanHolder: CustomerInfoData;
    assignedLoan: Array<LoanDataHolder>;
    cadCurrentStage: Stage;
    cadFileList: Array<CadFile>;
    offerDocumentList: Array<OfferDocument>;
    cadStageList: string;
    previousList: any;
    docStatus: CadDocStatus;


}
