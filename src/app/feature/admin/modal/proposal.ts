export class Proposal {
    id: number;
    version: number;
    data: string;
    proposedLimit: number;
    proposedAmountInWords: string;
    tenureDurationInMonths: number;
    checkedData: string;
    existingLimit: number;
    outStandingLimit: number;
    collateralRequirement: number;
    limitExpiryMethod: string;
    dateOfExpiry: Date;
    duration: number;
    condition: string;
    frequency: string;
    cashMargin: number;
    commissionPercentage: number;
    commissionFrequency: string;
    couponRate: number;
    premiumOnCouponRate: number;
    tenorOfEachDeal: string;
    cashMarginMethod: string;
    prepaymentCharge: number;
    enhanceLimitAmount: number;
    enhancementAmount: number;
    settlementAmount: number;

}
