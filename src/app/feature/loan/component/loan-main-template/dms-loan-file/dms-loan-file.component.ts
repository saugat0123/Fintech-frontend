import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {Document} from '../../../../admin/modal/document';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DmsLoanFile} from '../../../../admin/modal/dms-loan-file';
import {LoanDocument} from '../../../../admin/modal/loan-document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {DmsLoanService} from './dms-loan-service';
import {BeforeTodayValidator} from '../../../../../@core/validator/before-today-validator';

@Component({
    selector: 'app-dms-loan',
    templateUrl: './dms-loan-file.component.html',
    styleUrls: ['./dms-loan-file.component.css']
})
export class DmsLoanFileComponent implements OnInit {
    public static FILE_SIZE = 20000;
    initialDocuments: Document[] = [];
    renewDocuments: Document[] = [];
    document: LoanDocument = new LoanDocument();
    renew = false;
    loanForm: FormGroup;
    documentForm: FormGroup;
    loan: LoanConfig = new LoanConfig();
    permissions = [];
    loanFile: DmsLoanFile = new DmsLoanFile();
    documentPaths: string[] = [];
    documentPath: string;
    dropdownList = [];
    submitted = false;
    loanName: string;
    loanConfig: LoanConfig = new LoanConfig();
    customerId: number;
    errorMessage: string;
    dropdownPriorities = [];
    count = 0;
    proceed = false;
    documentMaps = [];
    documentMap: string;
    proceeded = false;

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private dmsLoanService: DmsLoanService,
                private toastService: ToastService) {
        this.loanFile.documents = Array<LoanDocument>();
    }

    get form() {
        return this.loanForm.controls;
    }

    get docForm() {
        return this.documentForm.controls;
    }

    ngOnInit() {
        this.loanName = this.dmsLoanService.getLoanName();
        this.loanConfig = this.dmsLoanService.getLoan();
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
            tenure: ['', [Validators.required, BeforeTodayValidator.tenureValidator]],
            priority: ['', Validators.required],
        });
        this.documentForm = this.formBuilder.group({
            recommendation: ['', Validators.required],
            waiver: ['', Validators.required],
            file: ['', Validators.required]
        });
        this.initialDocuments = this.dmsLoanService.getInitialDocument();
        this.renewDocuments = this.dmsLoanService.getRenewDocument();
        if (this.renewDocuments.length > 0) {
            this.renew = true;
        }
    }

    onSubmit() {
        this.submitted = true;
        if (this.loanForm.invalid) {
            return;
        } else {
            this.proceed = true;
        }
        this.loanFile.customerName = this.loanForm.get('customerName').value;
        this.loanFile.citizenshipNumber = this.loanForm.get('citizenshipNumber').value;
        this.loanFile.contactNumber = this.loanForm.get('contactNumber').value;
        this.loanFile.interestRate = this.loanForm.get('interestRate').value;
        this.loanFile.proposedAmount = this.loanForm.get('proposedAmount').value;
        this.loanFile.securities = this.loanForm.get('security').value;
        this.loanFile.tenure = this.loanForm.get('tenure').value;
        this.loanFile.priority = this.loanForm.get('priority').value;

        this.loanFile.waiver = this.documentForm.get('waiver').value;
        this.loanFile.recommendationConclusion = this.documentForm.get('recommendation').value;
        this.loanFile.documentMap = this.documentMaps;
        this.loanFile.loanConfig = this.loanConfig;
        this.dmsLoanService.save(this.loanFile).subscribe(
            (response: any) => {
                this.customerId = response.detail.id;
                this.loanFile = response.detail;
                this.dmsLoanService.setDmsLoanFile(response.detail);
                this.count++;
                if (this.count > 1) {
                    this.router.navigate(['/home/loan/summary', this.customerId]);
                }
            },
            error => {
                this.toastService.show(new Alert(AlertType.ERROR, 'Error occurred while saving!'));
            }
        );
    }

    onProceed() {
        this.proceeded = true;
        if (this.documentForm.invalid) {
            return;
        } else {
            this.onSubmit();
        }
    }

    documentUploader(event, documentName: string) {
        const file = event.target.files[0];
        if (file.size > DmsLoanFileComponent.FILE_SIZE) {
            this.errorMessage = 'Maximum File Size Exceeds';
        }
        const formdata: FormData = new FormData();
        formdata.append('file', file);
        formdata.append('type', this.loanName);
        formdata.append('id', this.customerId + '');
        formdata.append('customerName', this.loanFile.customerName);
        formdata.append('documentName', documentName);
        this.dmsLoanService.uploadFile(formdata).subscribe(
            (result: any) => {
                this.errorMessage = undefined;
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
            },
            error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Error occurred while uploading the document'));
            }
        );
    }
}
