/** common utility method for performing calculation **/

import {LoanDataHolder} from '../../model/loanData';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

export class ProposalCalculationUtils {
    public static calculateTotalFromProposalList(key: string, loanList: LoanDataHolder[]): number {
        let numb;
            const tempList = loanList
                .filter(l => JSON.parse(l.proposal.data)[key]);
            numb = tempList
                .map(l => JSON.parse(l.proposal.data)[key])
                .reduce((a, b) => a + b, 0);
        return this.isNumber(numb);
    }

    public static isNumber(value) {
        if (ObjectUtil.isEmpty(value)) {
            return 0;
        }
        if (Number.isNaN(value)) {
            return 0;
        } else {
            return value;
        }

    }

    public static calculateTotalFromProposalListKey( loanList: LoanDataHolder[]): number {
        let numb;
            const tempList = loanList
                .filter(l => JSON.parse(String(l.proposal.proposedLimit)));
            numb = tempList
                .map(l => JSON.parse(String(l.proposal.proposedLimit)))
                .reduce((a, b) => a + b, 0);
        return this.isNumber(numb);
    }

}
