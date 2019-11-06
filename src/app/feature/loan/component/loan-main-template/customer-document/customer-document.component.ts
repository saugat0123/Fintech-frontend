import {Component, Input, OnInit} from '@angular/core';
import {Document} from '../../../../admin/modal/document';
import {LoanDocument} from '../../../../admin/modal/loan-document';
import {LoanType} from '../../../model/loanType';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {ActivatedRoute, Params} from '@angular/router';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {LoanDataHolder} from '../../../model/loanData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {Documents} from '../../../model/documents';

@Component({
  selector: 'app-customer-document',
  templateUrl: './customer-document.component.html',
  styleUrls: ['./customer-document.component.scss']
})
export class CustomerDocumentComponent implements OnInit {
  public static FILE_SIZE_5MB = 5242880;
  public static FILE_SIZE_10MB = 10485760;
  @Input() loanDataHolder: LoanDataHolder;
  initialDocuments: Document[] = [];
  renewDocuments: Document[] = [];
  loanConfig: LoanConfig = new LoanConfig();
  document: LoanDocument = new LoanDocument();
  finalCustomerLoan: LoanDataHolder = new LoanDataHolder();
  loanName: string;

  documentMaps = [];
  docHeader = [];
  documentMap: string;

  paramProperties: any;

  errorMessage: string;

  constructor(private loanConfigService: LoanConfigService,
              private toastService: ToastService,
              private activatedRoute: ActivatedRoute,
              private loanFormService: LoanFormService) { }

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

    if (this.loanDataHolder.id !== undefined) {
      if (JSON.parse(this.loanDataHolder.customerDocument.documentPath) != null) {
        this.documentMaps = JSON.parse(this.loanDataHolder.customerDocument.documentPath);
        this.loanDataHolder.customerDocument.documentMap = JSON.parse(this.loanDataHolder.customerDocument.documentPath);
        this.documentMaps.forEach(d => {
          const arrayOfd = d.split(':')[0];
          this.docHeader.push(arrayOfd);
        });
      }
    } else {
      this.finalCustomerLoan.customerDocument = new Documents();
    }

    this.loanConfigService.detail(this.paramProperties.loanId).subscribe(
        (response: any) => {
          this.loanConfig = response.detail;
          this.loanName = this.loanConfig.name;
          if (LoanType[this.loanDataHolder.loanType] === LoanType.NEW_LOAN) {
            this.initialDocuments = this.loanConfig.initial;
          } else if (LoanType[this.loanDataHolder.loanType] === LoanType.RENEWED_LOAN) {
            this.initialDocuments = this.loanConfig.renew;
          } else if (LoanType[this.loanDataHolder.loanType] === LoanType.CLOSURE_LOAN) {
            this.initialDocuments = this.loanConfig.closure;
          } else {
            this.initialDocuments = this.loanConfig.initial;
          }

          this.initialDocuments.forEach(i => {
            this.docHeader.forEach(d => {
              if (d === i.displayName || d === i.name) {
                i.checked = true;
              }
            });
          });
        }
    );

    /*if (this.renewDocuments.length > 0) {
      this.renew = true;
    }*/
  }

  documentUploader(event, documentName: string, index: number) {
    const file = event.target.files[0];
    if (file.size > CustomerDocumentComponent.FILE_SIZE_5MB) {
      this.errorMessage = 'Maximum File Size Exceeds for  ' + documentName;
      (<HTMLInputElement>document.getElementById(`uploadDocument${index}`)).value = '';
    } else if (ObjectUtil.isEmpty(this.loanDataHolder.customerInfo.citizenshipNumber)) {
      this.toastService.show(new Alert(AlertType.ERROR, 'Citizenship Number is required to upload file.'));
      (<HTMLInputElement>document.getElementById(`uploadDocument${index}`)).value = '';
    } else if (ObjectUtil.isEmpty(this.loanDataHolder.customerInfo.customerName)) {
      this.toastService.show(new Alert(AlertType.ERROR, 'Customer Name is required to upload file.'));
      (<HTMLInputElement>document.getElementById(`uploadDocument${index}`)).value = '';
    } else {
      this.errorMessage = undefined;
      const formData: FormData = new FormData();

      formData.append('file', file);
      formData.append('type', this.loanName);
      formData.append('citizenNumber', this.loanDataHolder.customerInfo.citizenshipNumber);
      formData.append('customerName', this.loanDataHolder.customerInfo.customerName);
      formData.append('documentName', documentName);
      if (this.loanDataHolder.loanType === null || this.loanDataHolder.loanType === undefined) {
        formData.append('action', 'new');
      }

      if (LoanType[this.loanDataHolder.loanType] === LoanType.RENEWED_LOAN) {
        formData.append('action', 'renew');
      }

      if (LoanType[this.loanDataHolder.loanType] === LoanType.CLOSURE_LOAN) {
        formData.append('action', 'close');
      }
      this.loanFormService.uploadFile(formData).subscribe(
          (result: any) => {
            this.document.name = documentName;
            this.documentMap = documentName + ':' + result.detail;
            this.docHeader.push(documentName);
            this.initialDocuments.forEach(i => {
              this.docHeader.forEach(d => {
                if (d === i.displayName || d === i.name) {
                  i.checked = true;
                }
              });
            });

            if (this.documentMaps != null && !this.documentMaps.includes(this.documentMap)) {
              this.documentMaps.forEach(d => {
                const arrayOfd = d.split(':')[0];
                if (arrayOfd === documentName) {
                  const i = this.documentMaps.findIndex(order => order === d);
                  this.documentMaps.splice(i, 1);
                }
              });

              this.documentMaps.push(this.documentMap);
              console.log(this.documentMaps, this.finalCustomerLoan.customerDocument, 'asd');
            } else {
              this.documentMaps.push(this.documentMap);
            }
            this.finalCustomerLoan.customerDocument.documentMap = this.documentMaps;
            this.finalCustomerLoan.customerDocument.documentPath = this.documentMaps.map(x => x).join(',');
            this.document = new LoanDocument();
          },
          error => {
            console.error(error);
            (<HTMLInputElement>document.getElementById(`uploadDocument${index}`)).value = '';
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to upload Selected File.'
                + error.error.message));
          }
      );
    }
  }
}
