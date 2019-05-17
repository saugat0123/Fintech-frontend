import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Branch} from '../../../feature/admin/modal/branch';
import {ApprovalLimit} from '../../../feature/admin/modal/approval-limit';
import {User} from '../../../feature/admin/modal/user';
import {Valuator} from '../../../feature/admin/modal/valuator';
import {Sector} from '../../../feature/admin/modal/sector';
import {SubSector} from '../../../feature/admin/modal/sub-sector';
import {Segment} from '../../../feature/admin/modal/segment';
import {SubSegment} from '../../../feature/admin/modal/subSegment';
import {District} from '../../../feature/admin/modal/district';
import {MunicipalityVdc} from '../../../feature/admin/modal/municipality_VDC';
import {Province} from '../../../feature/admin/modal/province';
import {Nepse} from '../../../feature/admin/modal/nepse';
import {Company} from '../../../feature/admin/modal/company';
import {DmsLoanFile} from '../../../feature/admin/modal/dms-loan-file';
import {LoanConfig} from '../../../feature/admin/modal/loan-config';
import {Document} from '../../../feature/admin/modal/document';

@Injectable({
    providedIn: 'root'
})
export class CommonDataService {
    title: string;
    data: any;
    dataObj: any;
    alertmessage: String;
    loanType: string;
    branch: Branch = new Branch();
    document: Document = new Document();
    approvalLimit: ApprovalLimit = new ApprovalLimit();
    user: User = new User();
    valuator: Valuator = new Valuator();
    sector: Sector = new Sector();
    subSector: SubSector = new SubSector();
    segment: Segment = new Segment();
    subSegment: SubSegment = new SubSegment();
    district: District = new District();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    province: Province = new Province();
    nepse: Nepse = new Nepse();
    company: Company = new Company();
    renew: Document[] = [];
    initial: Document[] = [];
    dmsLoanfile: DmsLoanFile = new DmsLoanFile();
    loanConfig: LoanConfig;

    private breadcrumTitle = new BehaviorSubject('default message');
    currentTitle = this.breadcrumTitle.asObservable();

    private message = new BehaviorSubject('default message');
    currentMsg = this.message.asObservable();

    private alertFlag = new BehaviorSubject('default');

    currentAlertFlag = this.alertFlag.asObservable();

    // private customer = new BehaviorSubject<Customer>(new Customer);

    constructor() {
    }

    changeTitle(message: string) {
        this.breadcrumTitle.next(message);
    }

    getGlobalMsg(message: string) {
        this.message.next(message);
    }

    getAlertMsg(flag: string) {

        this.alertFlag.next(flag);
    }


    setDataList(datalist: Object) {
        this.data = datalist;
    }

    getDataList() {
        return this.data;
    }

    setData(dataObj: any) {
        this.dataObj = dataObj;
    }

    getData() {
        return this.dataObj;
    }

    setBranch(branch: Branch) {
        this.branch = branch;
    }

    getBranch() {
        return this.branch;
    }

    setApprovalLimit(approvalLimit: ApprovalLimit) {
        this.approvalLimit = approvalLimit;
    }

    getApprovalLimit() {
        return this.approvalLimit;
    }

    setUser(user: User) {
        console.log(user);
        this.user = user;
    }

    getUser() {
        return this.user;
    }


    setValuator(valuator: Valuator) {
        return this.valuator = valuator;
    }

    getValuator() {
        return this.valuator;
    }

    setSector(sector: Sector) {
        return this.sector = sector;
    }

    getSector() {
        return this.sector;
    }

    setSubSector(subSector: SubSector) {
        return this.subSector = subSector;
    }

    getSubSector() {
        return this.subSector;
    }

    setSegment(segment: Segment) {
        this.segment = segment;
    }

    getSegment() {
        return this.segment;
    }

    setSubSegment(subSegment: SubSegment) {
        this.subSegment = subSegment;
    }

    getSubSegment() {
        return this.subSegment;
    }

    setDistrict(district: District) {
        this.district = district;
    }

    setMunicipality(municipality: MunicipalityVdc) {
        this.municipality = municipality;
    }

    setProvince(province: Province) {
        this.province = province;
    }

    getProvince() {
        return this.province;
    }

    setNepse(nepse: Nepse) {
        this.nepse = nepse;
    }

    getNepse() {
        return this.nepse;
    }

    setDocument(document: Document) {
        this.document = document;
    }

    getDocument() {
        return this.document;
    }

    setCompany(company: Company) {
        this.company = company;
    }

    getCompany() {
        return this.company;
    }


    clearData() {
        this.dataObj = {};
    }

    setInitialDocument(documents: Document[]) {
        this.initial = documents;
    }

    setLoan(loanConfig: LoanConfig) {
        this.loanConfig = loanConfig;
    }

    getLoan() {
        return this.loanConfig;
    }

    setRenewDocument(docuemnts: Document[]) {
        this.renew = docuemnts;
    }

    getInitialDocument() {
        return this.initial;
    }

    getRenewDocument() {
        return this.renew;
    }

    setLoanName(name: string) {
        this.loanType = name;
    }

    getLoanName() {
        return this.loanType;
    }

    setDmsLoanFile(dmsLoanFile: DmsLoanFile) {
        this.dmsLoanfile = dmsLoanFile;
    }

    getDmsLoanFile() {
        return this.dmsLoanfile;
    }

}
