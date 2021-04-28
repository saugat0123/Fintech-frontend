export enum RepaymentHistory {
    NEW_CUSTOMER = 'New customer with no previous repayment history',
    BEFORE_DUE = 'All repayment/payment on or before due date',
    WITHIN_SEVEN_DAYS_FROM_DUE = 'Repayment/payment done within 7 working days from due date',
    WITHIN_THIRTY_DAYS_FROM_DUE = 'Repayment/payment done within 30 working days from due date/New customer with good' +
        ' credit history confirmed through account statement and CIC',
    AFTER_THIRTY_DAYS_FROM_DUE = 'Repayment/payment done after 30 working days from due date/New customer with uneven' +
        ' credit history confirmed though account statement and CIC and new customer with no credit' +
        ' history at any bank',
}

export class RepaymentHistoryMap {
    static repaymentHistoryMap: Map<string, number> = new Map([
        [RepaymentHistory.BEFORE_DUE, 3.50],
        [RepaymentHistory.WITHIN_SEVEN_DAYS_FROM_DUE, 2.45],
        [RepaymentHistory.WITHIN_THIRTY_DAYS_FROM_DUE, 1.75],
        [RepaymentHistory.AFTER_THIRTY_DAYS_FROM_DUE, 0],
        [RepaymentHistory.NEW_CUSTOMER, 0],
    ]);
}

export namespace RepaymentHistory {
    export function values() {
        return Object.keys(RepaymentHistory).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: RepaymentHistory[elem],
            });
        });
        return enums;
    }

    export function getEnum(value: string) {
        for (const elem of enumObject()) {
            if (elem.value === value) {
                return elem.key;
            }
        }
    }
}
