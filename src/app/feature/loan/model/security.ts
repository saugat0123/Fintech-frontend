import {Guarantor} from './guarantor';
import {ShareSecurity} from '../../admin/modal/shareSecurity';
import {SecuritiesType} from '../../constants/securities-type';
import {CollateralSiteVisit} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/CollateralSiteVisit';


export class Security {
    id: number;
    version: number;
    data: string;
    valuatorId: number;
    share: ShareSecurity;
    guarantor: Array<Guarantor>;
    fairMarketValue: number;
    distressValue: number;
    considerValue: number;
    securityType: SecuritiesType;
    coverage: number;
    usedAmount: number;
    freeLimit: number;
    templateName: string;
    securityLoanReferenceId: number;
    collateralSiteVisits: Array<CollateralSiteVisit>;
    status: any;
    oldSecurityId: number;
    isCrossCollateral: boolean;
    approved: boolean;
}
