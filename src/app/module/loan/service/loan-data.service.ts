import {Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
})
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

    constructor() {
    }

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
}
