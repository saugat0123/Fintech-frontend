import {Component, Input, OnInit} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {DocumentService} from '../../../admin/component/document/document.service';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-customer-doc',
  templateUrl: './customer-doc.component.html',
  styleUrls: ['./customer-doc.component.scss']
})
export class CustomerDocComponent implements OnInit {

  @Input()
  customerInfo: CustomerInfoData;
  generalDocumentReq = [];
  listOfLoanOfCustomer = [];
  errorMessage = '';
  uploadFile;

  constructor(private documentService: DocumentService, private loanService: LoanFormService) {
  }

  ngOnInit() {
    this.getGeneralLoanConfigDocument();
    this.getLoanOfLoanHolder();
  }

  onFileChange(e) {
    this.uploadFile = e.target.files[0];
  }

  getGeneralLoanConfigDocument() {
    this.documentService.getByLoanCycleAndStatus(9, 'ACTIVE').subscribe((res: any) => {
      this.generalDocumentReq = res.detail;
      if (!ObjectUtil.isEmpty(this.customerInfo.customerGeneralDocuments)) {
        const customerDocumentArray = this.customerInfo.customerGeneralDocuments;
        customerDocumentArray.forEach((singleDoc, i) => {
          this.generalDocumentReq.forEach((initDoc, j) => {
            if (singleDoc.document.id === initDoc.id) {
              initDoc.checked = true;
              initDoc.docPath = singleDoc.docPath;
            }
          });
        });
      }
    });
  }


  getLoanOfLoanHolder() {
    this.loanService.getLoansByLoanHolderId(this.customerInfo.id).subscribe((res: any) => {
      this.listOfLoanOfCustomer = res.detail;
      console.log(res);
    });
  }

}
