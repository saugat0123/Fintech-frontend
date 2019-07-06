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
import {LoanDataService} from '../../../service/loan-data.service';
import {Security} from '../../../../admin/modal/security';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {LoanDataHolder} from '../../../model/loanData';


@Component({
    selector: 'app-dms-loan',
    templateUrl: './dms-loan-file.component.html',
    styleUrls: ['./dms-loan-file.component.css']
})

export class DmsLoanFileComponent implements OnInit {
    public static FILE_SIZE = 1000000;
    @Input()
    loanFile: DmsLoanFile;

    initialDocuments: Document[] = [];
    renewDocuments: Document[] = [];
    document: LoanDocument = new LoanDocument();
    renew = true;
    loanForm: FormGroup;
    loan: LoanConfig = new LoanConfig();
    permissions = [];
    dropdownList = [];
    submitted = false;
    loanName: string;
    loanConfig: LoanConfig = new LoanConfig();
    customerId: number;
    errorMessage: string;
    dropdownPriorities = [];
    documentMaps = [];
    documentMap: string;
    allId;
    securities: string[];
    securityEnum: Security[] = [];
    imagePaths: string[] = [];
    imageUrl = [];
    action: string;
    loanConfigId: number;
    hasPreviousLoan = false;
    previousLoans: Array<LoanDataHolder>;
    spinner = false;

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
            {id: 'BUILDING_SECURITY', name: 'Building Security'},
            {id: 'VEHICLE_SECURITY', name: 'Vehicle Security'},
            {id: 'PROPERTY_AND_MACHINERY_SECURITY', name: 'Property and Machinery Security'}

        ];

        this.dropdownPriorities = [
            {id: 'HIGH', name: 'High'},
            {id: 'MEDIUM', name: 'Medium'},
            {id: 'LOW', name: 'Low'},

        ];
        console.log(this.loanFile);
        this.loanForm = this.formBuilder.group({
            customerName: [this.loanFile.customerName === undefined ? '' : this.loanFile.customerName, Validators.required],
            citizenshipNumber: [this.loanFile.citizenshipNumber === undefined ? '' : this.loanFile.citizenshipNumber, Validators.required],
            contactNumber: [this.loanFile.contactNumber === undefined ? '' : this.loanFile.contactNumber, Validators.required],
            interestRate: [this.loanFile.interestRate === undefined ? '' : this.loanFile.interestRate, Validators.required],
            proposedAmount: [this.loanFile.proposedAmount === undefined ? '' : this.loanFile.proposedAmount, Validators.required],
            security: [this.loanFile.security === undefined ? '' : this.showSecurity(this.loanFile.security), Validators.required],
            serviceChargeType: [this.loanFile.serviceChargeType === undefined ? 'Percentage' : this.loanFile.serviceChargeType,
                Validators.required],
            serviceChargeAmount: [this.loanFile.serviceChargeAmount === undefined ? '' : this.loanFile.serviceChargeAmount,
                Validators.required],
            tenureDuration: [this.loanFile.tenureDuration === undefined ? '' : this.loanFile.tenureDuration, Validators.required],
            priority: [this.loanFile.priority === undefined ? '' : this.loanFile.priority, Validators.required],
            recommendation: [this.loanFile.recommendationConclusion === undefined ? '' : this.loanFile.recommendationConclusion,
                Validators.required],
            waiver: [this.loanFile.waiver === undefined ? '' : this.loanFile.waiver, Validators.required],
            file: ['']
        });
        if (this.renewDocuments.length > 0) {
            this.renew = true;
        }

    }


    showSecurity(security: string) {
        this.securities = security.split(',');
        console.log('secties', this.securities);
        this.securities.forEach((securityLoop => {
            console.log(securityLoop);
            console.log(this.dropdownList[Number(securityLoop)].id);
            this.securityEnum.push(this.dropdownList[Number(securityLoop)].id);
            console.log(this.securityEnum);
        }));
        return this.securityEnum;
    }

    onSubmit() {
        this.loanFile.customerName = this.loanForm.get('customerName').value;
        this.loanFile.citizenshipNumber = this.loanForm.get('citizenshipNumber').value;
        this.loanFile.contactNumber = this.loanForm.get('contactNumber').value;
        this.loanFile.interestRate = this.loanForm.get('interestRate').value;
        this.loanFile.proposedAmount = this.loanForm.get('proposedAmount').value;
        this.loanFile.securities = this.loanForm.get('security').value as string;
        this.loanFile.tenureDuration = this.loanForm.get('tenureDuration').value;
        this.loanFile.serviceChargeType = this.loanForm.get('serviceChargeType').value;
        this.loanFile.serviceChargeAmount = this.loanForm.get('serviceChargeAmount').value;
        this.loanFile.priority = this.loanForm.get('priority').value;
        this.loanFile.waiver = this.loanForm.get('waiver').value;
        this.loanFile.recommendationConclusion = this.loanForm.get('recommendation').value;
        this.loanDataService.setDmsLoanFile(this.loanFile);
    }


    documentUploader(event, documentName: string) {
        const file = event.target.files[0];
        if (file.size > DmsLoanFileComponent.FILE_SIZE) {
            this.errorMessage = 'Maximum File Size Exceeds';
        }
        const formdata: FormData = new FormData();
        formdata.append('file', file);
        formdata.append('type', this.loanName);
        formdata.append('citizenNumber', String(this.loanForm.get('citizenshipNumber').value));
        formdata.append('customerName', this.loanForm.get('customerName').value);
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
                this.loanFile.documentMap = this.documentMaps;
                console.log(this.documentMap);
                this.document = new LoanDocument();
            },
            error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Error occurred while uploading the document'));
            }
        );
    }

    searchByCitizenship() {
        const citizenshipNumber = this.loanForm.get('citizenshipNumber').value;
        this.loanFormService.getLoansByCitizenship(citizenshipNumber).subscribe((response: any) => {
            this.previousLoans = response.detail;
            this.hasPreviousLoan = this.previousLoans.length > 0;
        }, error => console.error(error));
    }

    openLoan(loanConfigId: number, customerId: number) {
        this.spinner = true;
        this.router.navigate(['/home/loan/summary'], {
            queryParams: {
                loanConfigId: loanConfigId,
                customerId: customerId
            }
        });
    }

    hidePreviousLoans() {
        this.hasPreviousLoan = false;
    }
}
