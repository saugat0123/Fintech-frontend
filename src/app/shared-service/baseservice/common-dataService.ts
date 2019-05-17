import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {Branch} from '../../module/admin/modal/branch';
import {ApprovalLimit} from '../../module/admin/modal/approval-limit';
import {User} from '../../module/admin/modal/user';
import {Customer} from '../../module/admin/modal/customer';
import {Valuator} from '../../module/admin/modal/valuator';
import {Sector} from '../../module/admin/modal/sector';
import {SubSector} from '../../module/admin/modal/sub-sector';
import {Segment} from '../../module/admin/modal/segment';
import {District} from '../../module/admin/modal/district';
import {SubSegment} from '../../module/admin/modal/subSegment';
import {MunicipalityVdc} from '../../module/admin/modal/municipality_VDC';
import {Province} from '../../module/admin/modal/province';
import {Nepse} from '../../module/admin/modal/nepse';
import {Company} from '../../module/admin/modal/company';
import {Document} from '../../module/admin/modal/document';
import {DmsLoanFile} from '../../module/admin/modal/dms-loan-file';
import {LoanConfig} from '../../module/admin/modal/loan-config';


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
        this.dataObj = new Object();
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
