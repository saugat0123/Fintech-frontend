import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {Document} from '../../../../admin/modal/document';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DmsLoanFile} from '../../../../admin/modal/dms-loan-file';
import {LoanDocument} from '../../../../admin/modal/loan-document';

@Component({
    selector: 'app-dms-loan',
    templateUrl: './dms-loan-file.component.html',
    styleUrls: ['./dms-loan-file.component.css']
})
export class DmsLoanFileComponent implements OnInit {
    initialDocuments: Document[] = [];
    renewDocuments: Document[] = [];
    document: LoanDocument = new LoanDocument();
    renew = false;
    loanForm: FormGroup;
    loan: LoanConfig = new LoanConfig();
    permissions = [];
    loanFile: DmsLoanFile = new DmsLoanFile();
    documentPaths: string[] = [];
    documentPath: string;
    dropdownList = [];
    submitted = false;
    loanName: string;
    loanType: LoanConfig = new LoanConfig();
    customerId: number;
    proceed = false;
    errorMessage: string;
    dropdownPriorities = [];
    count = 0;
    documentMaps = [];
    documentMap: string;

    constructor(private commonService: CommonService,
                private dataService: CommonDataService,
                private formBuilder: FormBuilder,
                private router: Router) {
        this.loanFile.documents = Array<LoanDocument>();
    }

    get form() {
        return this.loanForm.controls;
    }

    ngOnInit() {
        this.loanName = this.dataService.getLoanName();
        this.loanType = this.dataService.getLoan();
        this.dropdownList = [
            {id: 0, name: 'Land Security'},
            {id: 1, name: 'Apartment Security'},
            {id: 2, name: 'Both'},

        ];
        this.dropdownPriorities = [
            {id: 'HIGH', name: 'High'},
            {id: 'MEDIUM', name: 'Medium'},
            {id: 'LOW', name: 'Low'},

        ];


        this.loanForm = this.formBuilder.group({
            customerName: ['', Validators.required],
            citizenshipNumber: ['', Validators.required],
            contactNumber: ['', Validators.required],
            interestRate: ['', Validators.required],
            proposedAmount: ['', Validators.required],
            security: ['', Validators.required],
            tenure: [''],
            priority: [''],
            recommendation: [''],
            waiver: [''],
            file: ['']
        });
        this.initialDocuments = this.dataService.getInitialDocument();
        this.renewDocuments = this.dataService.getRenewDocument();
        if (this.renewDocuments.length > 0) {
            this.renew = true;
        }
    }

    onSubmit() {
        // if (this.loanForm.invalid || this.errorMessage !== undefined) {
        if (this.loanForm.invalid) {
            return;
        }
        this.proceed = true;
        this.loanFile.customerName = this.loanForm.get('customerName').value;
        this.loanFile.citizenshipNumber = this.loanForm.get('citizenshipNumber').value;
        this.loanFile.contactNumber = this.loanForm.get('contactNumber').value;
        this.loanFile.interestRate = this.loanForm.get('interestRate').value;
        this.loanFile.proposedAmount = this.loanForm.get('proposedAmount').value;
        this.loanFile.securities = this.loanForm.get('security').value;
        this.loanFile.documentPaths = this.documentPaths;
        this.loanFile.tenure = this.loanForm.get('tenure').value;
        this.loanFile.priority = this.loanForm.get('priority').value;
        this.loanFile.recommendationConclusion = this.loanForm.get('recommendation').value;
        this.loanFile.waiver = this.loanForm.get('waiver').value;
        this.loanFile.documentMap = this.documentMaps;
        this.loanFile.loanType = this.loanType;
        this.commonService.saveOrEdit(this.loanFile, 'v1/dmsLoanFile').subscribe(
            (response: any) => {
                this.customerId = response.detail.id;
                this.loanFile = response.detail;
                this.dataService.setDmsLoanFile(response.detail);
                this.count++;
                if (this.count > 1) {
                    this.router.navigate(['/home/loan/summary', this.customerId]);
                }
            }
        );
    }

    documentUploader(event, documentName: string) {
        const file = event.target.files[0];
        const formdata: FormData = new FormData();
        formdata.append('file', file);
        formdata.append('type', this.loanName);
        formdata.append('id', this.customerId + '');
        formdata.append('customerName', this.loanFile.customerName);
        formdata.append('documentName', documentName);
        this.commonService.getByFilePost('v1/dmsLoanFile/uploadFile', formdata).subscribe(
            (result: any) => {
                this.document.name = documentName;
                this.documentPath = result.detail;
                if (!this.documentPaths.includes(result.detail)) {
                    this.documentPaths.push(this.documentPath);
                }
                this.loanFile.documents.push(this.document);
                this.documentMap = documentName + ':' + result.detail;
                if (!this.documentMaps.includes(this.documentMap)) {
                    this.documentMaps.push(this.documentMap);
                }
                this.document = new LoanDocument();
            });

        // (error) => {
        //     this.errorMessage = error.error.message;
        //     console.log(error.error.message);
        //     console.log(this.errorMessage);
        // });
        // this.errorMessage = undefined;
    }
}
