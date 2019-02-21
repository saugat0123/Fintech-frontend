import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { Pageable } from './common-pageable';
import { Branch } from '../../modal/branch';
import { Document } from '../../modal/document';

@Injectable({
    providedIn: 'root'
})
export class CommonDataService {
    title: string;
    data: any;
    dataObj: Object;

    branch: Branch = new Branch();
    document: Document = new Document();

    private breadcrumTitle = new BehaviorSubject('default message');
    currentTitle = this.breadcrumTitle.asObservable();

    private message = new BehaviorSubject('default message');
    currentMsg = this.message.asObservable();

    private alertFlag = new BehaviorSubject('default');
    currentAlertFlag = this.alertFlag.asObservable();

    constructor() {
    }

    changeTitle(message: string) {
        this.breadcrumTitle.next(message)
    }

    getGlobalMsg(message: string) {
        this.message.next(message)
    }

    getAlertMsg(flag: string) {

        this.alertFlag.next(flag)
    }



    setDataList(datalist: object) {
        this.data = datalist;
    }

    getDataList() {
        return this.data;
    }

    setData(dataObj: object) {
        this.dataObj = dataObj;
    }

    getData() {
        return this.dataObj;
    }

    setBranch(branch: Branch) {
        console.log(branch)
        this.branch = branch;
    }

    getBranch() {
        return this.branch;
    }

    setDocument(document: Document){
        console.log(document)
        this.document = document;
    }
    getDocument(){
        return this.document;
    }

}
