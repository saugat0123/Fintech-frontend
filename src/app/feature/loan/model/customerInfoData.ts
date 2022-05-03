import {SiteVisit} from '../../admin/modal/siteVisit';
import {Financial} from './financial';
import {Security} from './security';
import {GuarantorDetail} from './guarantor-detail';
import {Insurance} from '../../admin/modal/insurance';
import {CustomerGeneralDocument} from '../../customer/model/customerGeneralDocument';
import {CustomerGroup} from '../../admin/modal/customer-group';
import {CreditRiskGradingAlpha} from '../../admin/modal/CreditRiskGradingAlpha';
import {CreditRiskGrading} from '../../admin/modal/creditRiskGrading';
import {Branch} from '../../admin/modal/branch';
import {CustomerLoanFlag} from '../../../@core/model/customer-loan-flag';
import {CreditRiskGradingGamma} from '../../admin/modal/creditRiskGradingGamma';
import {CiclArray} from '../../admin/modal/cicl';
import {IncomeFromAccount} from '../../admin/modal/incomeFromAccount';
import {NetTradingAssets} from '../../admin/modal/NetTradingAssets';
import {CreditChecklistGeneral} from './creditChecklistGeneral';
import {MGroup} from '../../customer/model/mGroup';
import {BorrowerPortfolio} from './borrwerportfolio';
import {MarketingActivities} from './marketing-activities';
import {ReportingInfoLevel} from '../../reporting/model/reporting-info-level';
import {Comments} from '../../admin/modal/comments';
import {PreviousSecurity} from '../../admin/modal/previousSecurity';
import {MaritalStatus} from '../../../@core/model/enum/marital-status';
import {Gender} from '../../../@core/model/enum/gender';
import {MultipleBanking} from '../../admin/modal/multipleBanking';

export class CustomerInfoData {
    id: number;
    name: string;
    idType: any;
    idNumber: string;
    customerType: any;
    idRegDate: any;
    contactNo: string;
    email: string;
    idRegPlace: string;
    associateId: number;
    isBlacklist: boolean;
    branch: Branch;
    siteVisit: SiteVisit;
    financial: Financial;
    creditRiskGradingAlpha: CreditRiskGradingAlpha;
    creditRiskGrading: CreditRiskGrading;
    crgGamma: CreditRiskGradingGamma;
    version: number;
    security: Security;
    shareSecurity;
    guarantors: GuarantorDetail;
    insurance: Array<Insurance>;
    customerGeneralDocuments: Array<CustomerGeneralDocument>;
    customerGroup: CustomerGroup;
    profilePic: string;
    loanFlags: Array<CustomerLoanFlag>;
    cicl: CiclArray;
    incomeFromAccount: IncomeFromAccount;
    netTradingAssets: NetTradingAssets;
    bankingRelationship: string;
    creditChecklist: CreditChecklistGeneral;
    obligor: string;
    customerCode: string;
    subSectorDetailCode: string;
    nepData: string;
    gender: Gender;
    mgroupInfo: MGroup;
    borrowerPortFolio: BorrowerPortfolio;
    marketingActivities: MarketingActivities;
    clientType: any;
    reportingInfoLevels: Array<ReportingInfoLevel>;
    comments: Comments;
    previousSecurity: PreviousSecurity;
    data: string;
    subsectorDetail: string;
    maritalStatus: MaritalStatus;
    customerLegalDocumentAddress: string;
    multiBanking: MultipleBanking;
    commonLoanData: string;
    riskAnalysis: string;
    swotAnalysis: string;
    customerCategory: string;
}
