import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../../../../../shared-service/baseservice/common-baseservice';
import {ActivatedRoute} from '@angular/router';
import {LoanConfig} from '../../../../modal/loan-config';
import {Document} from '../../../../modal/document';
import {CommonDataService} from '../../../../../../shared-service/baseservice/common-dataService';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ClientInfo} from '../../../../modal/client-info';
import {ClientDocument} from '../../../../modal/client-document';

@Component({
    selector: 'app-client-service',
    templateUrl: './loan.component.html',
    styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit {
    loanType: string;
    initialDocuments: Document[] = [];
    renewDocuments: Document[] = [];
    document: ClientDocument = new ClientDocument();
    documents: ClientDocument[] = [];
    renew = false;
    loanForm: FormGroup;
    loan: LoanConfig = new LoanConfig();
    permissions = [];
    clientInfo: ClientInfo = new ClientInfo();
    clientDocument: ClientDocument = new ClientDocument();
    selectedSecurities = [];
    dropdownSettings = [];
    dropdownList = [];

    constructor(private commonService: CommonService,
                private dataService: CommonDataService,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.dropdownList = [
            {id: 'LAND_SECURITY', name: 'Land Security'},
            {id: 'APARTMENT_SECURITY', name: 'Apartment Security'},
            {id: 'BOTH_TYPE', name: 'Both'},

        ];

        this.loanForm = this.formBuilder.group({
            customerName: [''],
            citizenshipNumber: [''],
            contactNumber: [''],
            interestRate: [''],
            security: ['']
        });
        this.initialDocuments = this.dataService.getInitialDocument();
        this.renewDocuments = this.dataService.getRenewDocument();
        if (this.renewDocuments.length > 0) {
            this.renew = true;
        }
    }

    onSelect(item) {
        console.log(item);
        this.selectedSecurities = item;
        // this.selectedSecurities.push(event);
        console.log(this.selectedSecurities);
    }

    documentUploader(event, documentName: string, type: string) {
        const clientName = this.loanForm.get('customerName').value;
        const file = event.target.files[0];
        const formdata: FormData = new FormData();
        formdata.append('file', file);
        formdata.append('type', type);
        formdata.append('clientName', clientName);
        formdata.append('documentName', documentName);
        console.log(formdata);
        this.commonService.getByFilePost('v1/clientInfo/uploadFile', formdata).subscribe(
            (result: any) => {
                this.document.name = documentName;
                this.document.url = result.detail;
                this.document
                this.documents.push(this.document);
                console.log(this.documents);
            }
        );
    }

    onSubmit() {
        console.log(this.documents);
        this.clientInfo.name = this.loanForm.get('customerName').value;
        this.clientInfo.citizenshipNumber = this.loanForm.get('citizenshipNumber').value;
        this.clientInfo.contactNumber = this.loanForm.get('contactNumber').value;
        this.clientInfo.interestRate = this.loanForm.get('contactNumber').value;
        this.clientInfo.securities = this.loanForm.get('security').value;
        this.clientInfo.documents = this.documents;
        this.commonService.getByPost('v1/clientInfo',this.clientInfo).subscribe(
            (response)=> {
                console.log(response);
            }
        );
    }

}
