export enum KeyIndicatorsConstantsEnum {
    GROWTH = 'growth',
    SALES = 'sales',
    GROSS_PROFIT_KI = 'grossProfitKI',
    OPERATING_PROFIT_KI = 'operatingProfitKI',
    PAT = 'pAT',
    PROFITABILITY = 'profitability',
    GROSS_PROFIT_MARGIN = 'grossProfitMargin',
    NET_PROFIT_MARGIN = 'netProfitMargin',
    EBIT_TO_SALES = 'eBITtoSales',
    RETURN_ON_EQUITY = 'returnOnEquity',
    SOLVENCY = 'solvency',
    QUICK_RATIO = 'quickRatio',
    CURRENT_RATIO = 'currentRatio',
    DEBT_SERVICE_COVERAGE_RATIO = 'debtServiceCoverageRatio',
    INTEREST_COVERAGE_RATIO = 'interestCoverageRatio',
    DE_RATIO_EXCLUDING_LOAN_FROM_SHAREHOLDER_OR_DIRECTOR = 'deRatioExcludingLoanFromShareholderOrDirector',
    DE_RATIO_INCLUDING_LOAN_FROM_SHAREHOLDER_OR_DIRECTOR = 'deRatioIncludingLoanFromShareholderOrDirector',
    DEBT_EQUITY_RATIO_OVERALL = 'debtEquityRatioOverall',
    DEBT_EQUITY_RATIO_LONG_TERM = 'debtEquityRatioLongTerm',
    DEBT_EQUITY_RATIO_WORKING_CAPITAL = 'debtEquityRatioWorkingCapital',
    DEBT_EQUITY_RATIO_GENERAL = 'debtEquityRatioGeneral',
    LEVERAGE_RATIO = 'leverageRatio',
    OPERATING_CYCLE = 'operatingCycle',
    INVENTORY_TURNOVER_RATIO = 'inventoryTurnoverRatio',
    STOCK_IN_HAND_DAYS = 'stockInHandDays',
    DEBTOR_TURN_OVER_RATIO = 'debtorTurnOverRatio',
    AVERAGE_COLLECTION_PERIOD = 'averageCollectionPeriod',
    AVERAGE_PAYMENT_PERIOD = 'averagePaymentPeriod',
    NET_OPERATING_CYCLE = 'netOperatingCycle',
    NET_WC_BEFORE_BANK = 'netWCBeforeBank'
}

export class KeyIndicatorsHeaderMap {
    static KeyIndicatorsHeaderParticularMap: Map<string, string> = new Map([
        [KeyIndicatorsConstantsEnum.GROWTH, 'Growth'],
        [KeyIndicatorsConstantsEnum.SALES, 'Sales'],
        [KeyIndicatorsConstantsEnum.GROSS_PROFIT_KI, 'Gross Profit'],
        [KeyIndicatorsConstantsEnum.OPERATING_PROFIT_KI, 'Operating Profit(EBIT)'],
        [KeyIndicatorsConstantsEnum.PAT, 'PAT'],
        [KeyIndicatorsConstantsEnum.PROFITABILITY, 'Profitability'],
        [KeyIndicatorsConstantsEnum.GROSS_PROFIT_MARGIN, 'Gross Profit Margin'],
        [KeyIndicatorsConstantsEnum.NET_PROFIT_MARGIN, 'Net Profit Margin'],
        [KeyIndicatorsConstantsEnum.EBIT_TO_SALES, 'EBIT to Sales'],
        [KeyIndicatorsConstantsEnum.RETURN_ON_EQUITY, 'Return On Equity'],
        [KeyIndicatorsConstantsEnum.SOLVENCY, 'Solvency'],
        [KeyIndicatorsConstantsEnum.QUICK_RATIO, 'Quick Ratio (times)'],
        [KeyIndicatorsConstantsEnum.CURRENT_RATIO, 'Current Ratio (times)'],
        [KeyIndicatorsConstantsEnum.DEBT_SERVICE_COVERAGE_RATIO, 'Debt Service Coverage Ratio (times)'],
        [KeyIndicatorsConstantsEnum.INTEREST_COVERAGE_RATIO, 'Interest Coverage Ratio (times)'],
        [KeyIndicatorsConstantsEnum.DE_RATIO_EXCLUDING_LOAN_FROM_SHAREHOLDER_OR_DIRECTOR, 'DE Ratio (Excluding Loan from shareholder/director)'],
        [KeyIndicatorsConstantsEnum.DE_RATIO_INCLUDING_LOAN_FROM_SHAREHOLDER_OR_DIRECTOR, 'DE Ratio (Including Loan from shareholder/director)'],
        [KeyIndicatorsConstantsEnum.DEBT_EQUITY_RATIO_OVERALL, 'Debt-Equity Ratio (Overall)'],
        [KeyIndicatorsConstantsEnum.DEBT_EQUITY_RATIO_LONG_TERM, 'Debt-Equity Ratio - Long Term (times)'],
        [KeyIndicatorsConstantsEnum.DEBT_EQUITY_RATIO_WORKING_CAPITAL, 'Debt-Equity Ratio - Working Capital (times)'],
        [KeyIndicatorsConstantsEnum.DEBT_EQUITY_RATIO_GENERAL, 'Debt-Equity Ratio - General'],
        [KeyIndicatorsConstantsEnum.LEVERAGE_RATIO, 'Leverage ratio'],
        [KeyIndicatorsConstantsEnum.OPERATING_CYCLE, 'Operating Cycle'],
        [KeyIndicatorsConstantsEnum.INVENTORY_TURNOVER_RATIO, 'Inventory Turnover Ratio (times)'],
        [KeyIndicatorsConstantsEnum.STOCK_IN_HAND_DAYS, 'Stock in Hand - Days'],
        [KeyIndicatorsConstantsEnum.DEBTOR_TURN_OVER_RATIO, 'Debtor Turnover Ratio (times)'],
        [KeyIndicatorsConstantsEnum.AVERAGE_COLLECTION_PERIOD, 'Average Collection Period - Days'],
        [KeyIndicatorsConstantsEnum.AVERAGE_PAYMENT_PERIOD, 'Average Payment Period - Days'],
        [KeyIndicatorsConstantsEnum.NET_OPERATING_CYCLE, 'Net Operating Cycle - Days'],
        [KeyIndicatorsConstantsEnum.NET_WC_BEFORE_BANK, 'Net WC before Bank']
    ]);
}

export namespace KeyIndicatorsConstantsEnum {
    export function keys() {
        return Object.keys(KeyIndicatorsConstantsEnum).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function values() {
        const enumValues = [];
        keys().forEach(elem => {
            if (typeof KeyIndicatorsConstantsEnum[elem] === 'string') {
                enumValues.push(KeyIndicatorsConstantsEnum[elem]);
            }
        });
        return enumValues;
    }
}
