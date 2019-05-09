import {Injectable} from '@angular/core';
import {MemoType} from '../model/memoType';
import {Memo} from '../model/memo';

@Injectable({
    providedIn: 'root'
})
export class LoanDataService {


    prvs = {};
    url: string;
    name: string;
    index;
    nxt = {};

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
