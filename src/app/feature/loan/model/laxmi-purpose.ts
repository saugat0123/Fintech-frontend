export enum LaxmiPurpose {

    WORKING_CAPITAL = 'चालु पूंजीमा लगानी गर्न ।',
    SHARE_USE = 'शेयरमा लगानी गर्न ।',
    PERSONAL_USE = 'व्यक्तिगत प्रयोजनको लागी ।',
    FAMILY_USE = 'परिवारिक प्रयोजनको लागि ।',
    PERSONAL_DEBT_REPAYMENT = 'व्यक्तिगत ऋण चुक्ता गर्नका लागी ।',
    FINANCIAL_ASSETS = 'वित्तीय सम्पत्तिमा लगानी गर्न ।',
    CAPITAL_EXPENDITURE = 'पुंँजीगत खर्चमा लगानी गर्न |',
    FIXED_ASSETS = 'स्थिर सम्पतिमा लगानी गर्न ।',
    VEHICLE = 'सवारी साधनमा लगानी गर्न ।',
    FIXED_ASSETS_RETURN = 'स्थिर सम्पतिमा पुनः लगानी गर्न ।',
    VARIOUS_MATERIAL = 'विभिन्न सामग्री आयात गर्न ।',
    LAND_BUILDING_PURCHASE = 'घर/जग्गा खरिद गर्नको लागी ।',
    BUILD_MAINTAI_HOUSE = 'घर निर्माण/मर्मत सम्भार गर्नको लागी ।',
    BID_GUARANTEE = 'बिड ग्यारेण्टी जारी गर्न ।',
    PERFORMANCE_GUARANTEE = 'परफरमेन्स ग्यारेण्टी जारी गर्न ।',
    ADVANCEMENT_PAYMENT_GUARANTEE = 'अग्रिम भुक्तानी ग्यारेण्टी जारी गर्न ।',
    EXIM_CODE = 'Exim Code जारी गर्न ।',
    EDUCATIONAL_USE = 'शैक्षिक खर्चको लागी ।',
    TRADE_BUSINESS = 'व्यापार/व्यवसायमा लगानी गर्न ।'
}

export namespace LaxmiPurpose {
    export function values() {
        return Object.keys(LaxmiPurpose).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'value'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(value => {
            enums.push({
                key: value,
                value: LaxmiPurpose[value]
            });
        });
        return enums;
    }
}

