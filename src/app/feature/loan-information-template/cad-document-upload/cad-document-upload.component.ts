import { Component, OnInit } from '@angular/core';
import {CadDocument} from '../../loan/model/cadDocument';
import {CustomerDocuments} from '../../loan/model/customerDocuments';
import {LoanConfig} from '../../admin/modal/loan-config';
import {LoanDataHolder} from '../../loan/model/loanData';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {ToastService} from '../../../@core/utils';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Document} from '../../admin/modal/document';
import {CustomerLoanDocumentComponent} from '../customer-loan-document/customer-loan-document.component';
import {Alert, AlertType} from '../../../@theme/model/Alert';

@Component({
  selector: 'app-cad-document-upload',
  templateUrl: './cad-document-upload.component.html',
  styleUrls: ['./cad-document-upload.component.scss']
})
export class CadDocumentUploadComponent implements OnInit {
  paramProperties: any;
  loanName: string;
  loanConfig: LoanConfig = new LoanConfig();
  errorMessage: string;
  customerDocumentArray: Array<CadDocument> = new Array<CustomerDocuments>();
  initialDocuments: Document[] = [];
  loanDataHolder: LoanDataHolder = new LoanDataHolder();
  constructor(private loanConfigService: LoanConfigService,
              private toastService: ToastService,
              private activatedRoute: ActivatedRoute,
              private loanFormService: LoanFormService,
              private route: Router) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
        (paramsValue: Params) => {
          this.paramProperties = {
            loanId: null,
            customerId: null,
            loanCategory: null
          };
          this.paramProperties = paramsValue;
        });
    this.loanFormService.detail(this.paramProperties.customerId).subscribe(
        (response: any) => {
          this.loanDataHolder = response.detail;
          console.log(this.loanDataHolder,'ld');
          this.loanDataHolder.id = response.detail.id;
          this.getLoanData();
        });
  }

  getLoanData() {
    this.loanConfigService.detail(this.paramProperties.loanId).subscribe(
        (response: any) => {
          this.loanConfig = response.detail;
          this.loanName = this.loanConfig.name;
          this.initialDocuments = this.loanConfig.approvedDocument;
          if (!ObjectUtil.isEmpty(this.loanDataHolder.cadDocument)) {
            this.customerDocumentArray = this.loanDataHolder.cadDocument;
            const savedCADDocumentIds = this.customerDocumentArray.map(v => v.document.id);
            this.initialDocuments.forEach(initDoc =>
                initDoc.checked = savedCADDocumentIds.includes(initDoc.id)
            );
          }
        }
    );
  }

  documentUploader(event, documentName: string, documentId, index: number) {
    const file = event.target.files[0];
    if (file.size > CustomerLoanDocumentComponent.FILE_SIZE_5MB) {
      this.errorMessage = 'Maximum File Size Exceeds for  ' + documentName;
      (<HTMLInputElement>document.getElementById(`uploadDocument${index}`)).value = '';
    } else {
      this.errorMessage = undefined;
      const formData: FormData = new FormData();

      formData.append('file', file);
      formData.append('documentName', documentName);
      formData.append('documentId', documentId);
      formData.append('customerLoanId', this.loanDataHolder.id.toString());

      this.loanFormService.uploadLoanCadFile(formData).subscribe(
          (result: any) => {
            const customerDocumentObject = result.detail;
            if (this.customerDocumentArray.length > 0) {
              this.customerDocumentArray.forEach((singleDoc, docIndex) => {
                if (singleDoc.document.id === documentId) {
                  this.customerDocumentArray.splice(docIndex, 1);
                }
              });
            }
            this.customerDocumentArray.push(customerDocumentObject);
            this.initialDocuments[index].checked = true;
          },
          error => {
            this.initialDocuments[index].checked = false;
            (<HTMLInputElement>document.getElementById(`uploadDocument${index}`)).value = '';
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to upload Selected File.'
                + error.error.message));
          }
      );
    }
  }

  saveLoan() {
    this.loanDataHolder.customerDocument =  this.customerDocumentArray;
    this.loanFormService.saveCustomerDocument(this.loanDataHolder.id , this.customerDocumentArray).subscribe(value => {
      this.route.navigate(['/home/loan/summary'], {
        queryParams: {
          loanConfigId: this.paramProperties.loanId,
          customerId: this.paramProperties.customerId
        }
      });
    });
  }

  backUrl() {
    history.back();
  }
}
