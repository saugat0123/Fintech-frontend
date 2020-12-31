import {BaseEntity} from '../../../@core/model/base-entity';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {LoanDataHolder} from '../../loan/model/loanData';
import {Stage} from '../../loan/model/stage';

export class CustomerApprovedLoanCadDocumentation extends BaseEntity {

    loanHolder: CustomerInfoData;
    assignedLoan: Array<LoanDataHolder>;
    cadCurrentStage: Stage;
    cadFileList: Array<any>;
    cadStageList: string;
    previousList: string;


}
