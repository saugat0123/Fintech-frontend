export class OpeningCustomerRelative {
    title: string;
    customerRelation: string;
    customerRelativeName: string;
    citizenshipNumber: string;
    citizenshipIssuedPlace: string;
    citizenshipIssuedDate: Date;

    constructor(customerRelation: string, customerRelativeName: string) {
        this.customerRelation = customerRelation;
        this.customerRelativeName = customerRelativeName;
    }

}
