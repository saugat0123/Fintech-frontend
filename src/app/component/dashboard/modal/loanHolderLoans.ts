import {LoanDataHolder} from '../../../feature/loan/model/loanData';
import {CustomerInfoData} from '../../../feature/loan/model/customerInfoData';

export class LoanHolderLoans {

    customerInfo: CustomerInfoData;

    loanSingleList: Array<LoanDataHolder>;

    totalLoan: number;

    combineList: Array<Map<number, Array<LoanDataHolder>>>;

}
