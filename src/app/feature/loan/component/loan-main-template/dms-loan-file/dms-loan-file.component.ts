import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {Document} from '../../../../admin/modal/document';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DmsLoanFile} from '../../../../admin/modal/dms-loan-file';
import {LoanDocument} from '../../../../admin/modal/loan-document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {DmsLoanService} from './dms-loan-service';
import {AfterTodayValidator} from '../../../../../@core/validator/after-today-validator';
import {LoanDataService} from '../../../service/loan-data.service';
import {Security} from '../../../../admin/modal/security';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../model/loanData';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';


@Component({
    selector: 'app-dms-loan',
    templateUrl: './dms-loan-file.component.html',
    styleUrls: ['./dms-loan-file.component.css']
})

export class DmsLoanFileComponent implements OnInit {
    public static FILE_SIZE = 20000;
    @Input()
    loanFile: DmsLoanFile;
    initialDocuments: Document[] = [];
    renewDocuments: Document[] = [];
    document: LoanDocument = new LoanDocument();
    renew = false;
    loanForm: FormGroup;
    documentForm: FormGroup;
    loan: LoanConfig = new LoanConfig();
    permissions = [];
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
    allId;
    securities: string[];
    securityEnum: Security[] = [];
    imagePaths: string[] = [];
    imageUrl = [];
    imagePathMap: string[] = [];
    action: string;
    loanDataHolder: LoanDataHolder = new LoanDataHolder();
    loanConfigId: number;

    constructor(private formBuilder: FormBuilder,
                private loanDataService: LoanDataService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private dmsLoanService: DmsLoanService,
                private loanFormService: LoanFormService,
                private loanConfigService: LoanConfigService,
                private toastService: ToastService) {
    }

    get form() {
        return this.loanForm.controls;
    }

    get docForm() {
        return this.documentForm.controls;
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.allId = {
                    loanId: null,
                    customerId: null
                };
                this.allId = paramsValue;
                this.customerId = this.allId.customerId;
                this.loanConfigId = this.allId.loanId;

            });

        if (this.loanFile.id !== undefined) {
            this.action = 'EDIT';
            this.proceed = true;
            this.imagePaths = JSON.parse(this.loanFile.documentPath);
        }
        this.loanConfigService.detail(this.loanConfigId).subscribe(
            (response: any) => {
                this.loanConfig = response.detail;
                this.loanName = this.loanConfig.name;
                this.initialDocuments = this.loanConfig.initial;
                this.renewDocuments = this.loanConfig.renew;
            }
        );

        this.dropdownList = [
            {id: 'LAND_SECURITY', name: 'Land Security'},
            {id: 'APARTMENT_SECURITY', name: 'Apartment Security'},
            {id: 'BOTH_TYPE', name: 'Both'},

        ];

        this.dropdownPriorities = [
            {id: 'HIGH', name: 'High'},
            {id: 'MEDIUM', name: 'Medium'},
            {id: 'LOW', name: 'Low'},

        ];

        this.loanForm = this.formBuilder.group({
            customerName: [this.loanFile.customerName === undefined ? '' : this.loanFile.customerName, Validators.required],
            citizenshipNumber: [this.loanFile.citizenshipNumber === undefined ? '' : this.loanFile.citizenshipNumber, Validators.required],
            contactNumber: [this.loanFile.contactNumber === undefined ? '' : this.loanFile.contactNumber, Validators.required],
            interestRate: [this.loanFile.interestRate === undefined ? '' : this.loanFile.interestRate, Validators.required],
            proposedAmount: [this.loanFile.proposedAmount === undefined ? '' : this.loanFile.proposedAmount, Validators.required],
            security: [this.loanFile.security === undefined ? '' : this.showSecurity(this.loanFile.security), Validators.required],
            tenure: [this.loanFile.tenure === undefined ? '' : this.loanFile.tenure, [Validators.required, AfterTodayValidator.isValid]],
            priority: [this.loanFile.priority === undefined ? '' : this.loanFile.priority, Validators.required],
        });
        this.documentForm = this.formBuilder.group({
            recommendation: [this.loanFile.recommendationConclusion === undefined ? '' : this.loanFile.recommendationConclusion,
                Validators.required],
            waiver: [this.loanFile.waiver === undefined ? '' : this.loanFile.waiver, Validators.required],
            file: ['', Validators.required]
        });
        if (this.renewDocuments.length > 0) {
            this.renew = true;
        }
        if (this.action === 'EDIT') {
            this.documentForm.controls['file'].setValidators([]);
        }

    }


    showSecurity(security: string) {
        this.securities = security.split(',');
        this.securities.forEach((securityLoop => {
            this.securityEnum.push(Security[securityLoop]);
        }));
        return this.securityEnum;
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
        this.loanFile.documentMap = this.action === 'EDIT' ? this.imagePaths : this.documentMaps;
        this.loanDataService.setDmsLoanFile(this.loanFile);
        this.save();

    }

    save() {
        console.log(this.loanFile);
        this.dmsLoanService.save(this.loanFile).subscribe(
            (response: any) => {
                this.customerId = response.detail.id;
                this.loanFile = response.detail;
                console.log('response', response);
                this.loanFile.securities = this.loanForm.get('security').value;
                this.loanFile.security = null;
                this.loanDataService.setDmsLoanFile(this.loanFile);
            },
            error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Error occurred while saving!'));
            }
        );
    }

    onProceed() {
        this.proceeded = true;
        if (this.action === 'EDIT') {
            this.count++;
        }
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
