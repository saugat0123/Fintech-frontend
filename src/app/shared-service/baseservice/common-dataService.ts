import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { Pageable } from './common-pageable';
import { Branch } from '../../modal/branch';

@Injectable({
    providedIn: 'root'
})
export class CommonDataService {
    title: string;
   data:any;
   branch : Branch = new Branch();

    private breadcrumTitle = new BehaviorSubject('default message');
    currentTitle = this.breadcrumTitle.asObservable();

    private message = new BehaviorSubject('default message');
    currentMsg = this.message.asObservable();

    constructor() {
    }

    changeTitle(message: string) {
        this.breadcrumTitle.next(message)
    }

    getGlobalMsg(message:string){
        this.message.next(message)
    }

    setDataList(datalist:object){
            this.data = datalist;
    }

    getDataList(){
        return this.data;
    }

    setBranch(branch:Branch){
        this.branch = branch;
    }

    getBranch(){
        return this.branch;
    }


}
