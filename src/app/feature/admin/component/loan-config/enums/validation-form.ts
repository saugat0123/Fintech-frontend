
export enum ValidationForm {
    HOME_LOAN_VALIDATION = 'Home Loan Validation',
    AUTO_LOAN_PERSONAL_VALIDATION = 'Auto Loan Personal Validation'
}

export namespace ValidationForm {
    export function value(validationForm: ValidationForm) {
        switch (validationForm) {
            case ValidationForm.HOME_LOAN_VALIDATION:
                return 'Home Loan Validation';
            case ValidationForm.AUTO_LOAN_PERSONAL_VALIDATION:
                return 'Auto Loan Validation';
        }
    }


    export function keysEnum(validationFormConst: string) {
        let key = null;
        Object.keys(ValidationForm).forEach(o => {
            if (ValidationForm.value(ValidationForm[o]) === validationFormConst) {
                key = o;
            }
        });
        return key;
    }

    export function values() {
        return Object.keys(ValidationForm).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'value' && type !== 'keysEnum' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach( val => {
            enums.push({
                key: val,
                value: ValidationForm[val]
            });
        });
        return enums;
    }

}
