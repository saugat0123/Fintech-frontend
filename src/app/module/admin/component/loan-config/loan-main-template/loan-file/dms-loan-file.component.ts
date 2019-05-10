import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../../../../../shared-service/baseservice/common-baseservice';
import {ActivatedRoute} from '@angular/router';
import {LoanConfig} from '../../../../modal/loan-config';
import {Document} from '../../../../modal/document';
import {CommonDataService} from '../../../../../../shared-service/baseservice/common-dataService';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DmsLoanFile} from '../../../../modal/dms-loan-file';
import {LoanDocument} from '../../../../modal/loan-document';

@Component({
    selector: 'app-client-service',
    templateUrl: './dms-loan-file.component.html',
    styleUrls: ['./dms-loan-file.component.css']
})
export class DmsLoanFileComponent implements OnInit {
    initialDocuments: Document[] = [];
    renewDocuments: Document[] = [];
    document: LoanDocument = new LoanDocument();
    documents: LoanDocument[] = [];
    renew = false;
    loanForm: FormGroup;
    loan: LoanConfig = new LoanConfig();
    permissions = [];
    loanFile: DmsLoanFile = new DmsLoanFile();
    documentPaths: string[] = [];
    documentPath: string;
    dropdownList = [];
    submitted = false;
    loanType: string;
    showError = false;

    constructor(private commonService: CommonService,
                private dataService: CommonDataService,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder) {
    }

    get form() {
        return this.loanForm.controls;
    }

    ngOnInit() {
        this.loanType = this.dataService.getLoanName();
        this.dropdownList = [
            {id: 'LAND_SECURITY', name: 'Land Security'},
            {id: 'APARTMENT_SECURITY', name: 'Apartment Security'},
            {id: 'BOTH_TYPE', name: 'Both'},

        ];

        this.loanForm = this.formBuilder.group({
            customerName: ['', Validators.required],
            citizenshipNumber: ['', Validators.required],
            contactNumber: ['', Validators.required],
            interestRate: ['', Validators.required],
            proposedAmount: ['', Validators.required],
            security: ['', Validators.required],
            file: ['']
        });
        this.initialDocuments = this.dataService.getInitialDocument();
        this.renewDocuments = this.dataService.getRenewDocument();
        if (this.renewDocuments.length > 0) {
            this.renew = true;
        }
    }

    documentUploader(event, documentName: string) {
        const maxSize = 1000;
        const customerName = this.loanForm.get('customerName').value;
        const file = event.target.files[0];
        const size = event.target.files[0].size;
        if (size > maxSize) {

        }
        console.log(size);
        console.log(this.showError);
        const formdata: FormData = new FormData();
        formdata.append('file', file);
        formdata.append('type', this.loanType);
        formdata.append('customerName', customerName);
        formdata.append('documentName', documentName);
        this.commonService.getByFilePost('v1/dmsLoanFile/uploadFile', formdata).subscribe(
            (result: any) => {
                this.documentPath = result.detail;
                if (!this.documentPaths.includes(result.detail)) {
                    this.documentPaths.push(this.documentPath);
                }
            }
        );
        console.log(this.documentPaths);
    }

    onSubmit() {
        this.submitted = true;
        if (this.loanForm.invalid) {
            return;
        }
        console.log(this.documents);
        this.loanFile.name = this.loanForm.get('customerName').value;
        this.loanFile.citizenshipNumber = this.loanForm.get('citizenshipNumber').value;
        this.loanFile.contactNumber = this.loanForm.get('contactNumber').value;
        this.loanFile.interestRate = this.loanForm.get('interestRate').value;
        this.loanFile.proposedAmount = this.loanForm.get('proposedAmount').value;
        this.loanFile.securities = this.loanForm.get('security').value;
        this.loanFile.documentPath = this.documentPaths;
        console.log(this.loanFile);

        // this.commonService.saveOrEdit(this.loanFile, 'v1/dmsLoanFile').subscribe(
        //     (response) => {
        //         console.log(response);
        //     }
        // );
    }

}
