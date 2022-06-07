import {DocStatus} from '../../loan/model/docStatus';
import {LoanDataHolder} from '../../loan/model/loanData';
import {CreditMemoType} from './credit-memo-type';
import {CreditMemoStage} from './credit-memo-stage';
import {CreditMemoDocument} from './credit-memo-document';
import {CreditMemoMemoTypeDocument} from './credit-memo-memo-type-document';

export class CreditMemo {
    id: number;
    type: CreditMemoType;
    referenceNumber: string;
    subject: string;
    content: string;
    currentStage: CreditMemoStage;
    documentStatus: DocStatus;
    customerLoan: LoanDataHolder [];
    previousStages: Array<CreditMemoStage>;
    documents: Array<CreditMemoDocument>;
    distinctPreviousList: any;
    version: number;
    createdAt: string;
    memoTypeDocuments: Array<CreditMemoMemoTypeDocument>;
    proposalData: string;
}
