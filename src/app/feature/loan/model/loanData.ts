import {CompanyInfo} from '../../admin/modal/company-info';
import {DmsLoanFile} from '../../admin/modal/dms-loan-file';
import {LoanConfig} from '../../admin/modal/loan-config';
import {DocStatus} from './docStatus';
import {Priority} from './priority';
import {Customer} from '../../admin/modal/customer';
import {LoanStage} from './loanStage';
import {Proposal} from '../../admin/modal/proposal';
import {Branch} from '../../admin/modal/branch';
import {Cicl} from '../../admin/modal/cicl';
import {Insurance} from '../../admin/modal/insurance';
import {LoanType} from './loanType';
import {Financial} from './financial';
import {Security} from './security';
import {SiteVisit} from '../../admin/modal/siteVisit';
import {CustomerDocuments} from './customerDocuments';
import {CustomerOfferLetter} from './customer-offer-letter';
import {CreditRiskGrading} from '../../admin/modal/creditRiskGrading';

import {Group} from './group';

export class LoanDataHolder {
    id: number;
    branch: Branch;
    loanCategory: any;
    customerInfo: Customer;
    companyInfo: CompanyInfo;
    dmsLoanFile: DmsLoanFile;
    proposal: Proposal;
    loan: LoanConfig;
    ciclList: Array<Cicl>;
    ciclRemarks: string;
    insurance: Insurance;
    documentStatus: DocStatus;
    customerDocument: Array<CustomerDocuments>;
    siteVisit: SiteVisit;
    financial: Financial;
    security: Security;
    priority: Priority;
    createdAt: Date;
    previousList: LoanStage[] = [];
    previousStageList: string;
    distinctPreviousList: any;
    currentStage: LoanStage = new LoanStage();
    loanType: LoanType;
    createdBy: number;
    parentId: number;
    childId: number;
    isCloseRenew: boolean;
    pulled: boolean;
    customerOfferLetter: CustomerOfferLetter;
    offerLetterStat: number;
    uploadedOfferLetterStat: number;
    creditRiskGrading: CreditRiskGrading;
    group: Group;

}
