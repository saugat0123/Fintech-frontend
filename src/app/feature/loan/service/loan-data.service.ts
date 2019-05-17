import {Injectable} from '@angular/core';
import {Customer} from '../../admin/modal/customer';
import {EntityInfo} from '../../admin/modal/entity-info';
import {LoanDataHolder} from '../model/loanData';


@Injectable({
    providedIn: 'root'
})

// export interface LooseObject {
//     [key: string]: any
// }

export class LoanDataService {


    prvs = {
        url: null,
        index: null,
        name: null
    };
    url: string;
    name: string;
    index;
    nxt = {
        url: null,
        index: null,
        name: null
    };

    customer: Customer = new Customer();
    entityInfo: EntityInfo = new EntityInfo();
    loanDocument: LoanDataHolder = new LoanDataHolder();


    setNext(index, url, name) {
        this.nxt = {
            url: url,
            index: index,
            name: name
        };

    }

    getNext() {
        return this.nxt;
    }

    setPrevious(index, url, name) {
        this.prvs = {
            url: url,
            index: index,
            name: name
        };
    }

    getPrevious() {
        return this.prvs;
    }

    setLoanDocuments(loanDoc) {
        this.loanDocument = loanDoc;

    }

    getLoanDocuments() {
        return this.loanDocument;
    }

    setCustomer(customer: Customer) {
        this.customer = customer;
        this.loanDocument.customer = this.customer;
    }

    getCustomer() {
        return this.customer;
    }

    setEntityInfo(entityInfo: EntityInfo) {
        this.entityInfo = entityInfo;
        this.loanDocument.entityInfo = this.entityInfo;
    }

    getEntityInfo() {
        return this.entityInfo;
    }

}
