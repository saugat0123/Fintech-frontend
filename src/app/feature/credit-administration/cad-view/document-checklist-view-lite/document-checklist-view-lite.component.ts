import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {RemarksEnum} from '../../../admin/modal/remarksEnum';
import {Document} from '../../../admin/modal/document';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {ToastService} from '../../../../@core/utils';
import {NbDialogService} from '@nebular/theme';
import {RouterUtilsService} from '../../utils/router-utils.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DocumentService} from '../../../admin/component/document/document.service';
import {Status} from '../../../../@core/Status';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {CadChecklistDocTemplateModalComponent} from '../../cad-offerletter-profile/cad-checklist-doc-template-modal/cad-checklist-doc-template-modal.component';
import {LaxmiOfferLetterConst} from '../../cad-document-template/laxmi/laxmi-offer-letter/laxmi-offer-letter-const';
import {CommonService} from '../../../../@core/service/common.service';
import {LoanTag} from '../../../loan/model/loanTag';

@Component({
  selector: 'app-document-checklist-view-lite',
  templateUrl: './document-checklist-view-lite.component.html',
  styleUrls: ['./document-checklist-view-lite.component.scss']
})
export class DocumentChecklistViewLiteComponent implements OnInit {

  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  customerLoanList: Array<LoanDataHolder>;
  customerCadFile = [];

  spinner = false;

  remarkOption = RemarksEnum.enumObject();


  document: Array<Document> = [];

  constructor(private creditAdministrationService: CreditAdministrationService,
              private toastService: ToastService,
              private nbDialogService: NbDialogService,
              private routerUtilsService: RouterUtilsService,
              private modelService: NgbModal,
              private documentService: DocumentService,
              public commonService: CommonService
  ) {
  }

  ngOnInit() {
    this.initial();
  }

  initial() {
    this.documentService.getByLoanCycleAndStatus(12, Status.ACTIVE).subscribe(res => {
      this.document = res.detail;
      if (!ObjectUtil.isEmpty(this.cadData) && !(ObjectUtil.isEmpty(this.document))) {
        this.customerLoanList = this.cadData.assignedLoan;

        this.cadData.cadFileList.forEach(singleCadFile => {
          this.document.forEach(singleDocument => {
            if (singleDocument.id === singleCadFile.cadDocument.id) {
              singleDocument.checked = true;
              singleDocument.url = singleCadFile.path;
              singleDocument.amount = singleCadFile.amount;
              singleDocument.remarks = singleCadFile.remarks;
              singleDocument.uploadedDate = singleCadFile.uploadedDate;
            }
          });
        });
      }
    }, error => {
      console.log(error);
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Unable to load document '));

    });
  }


  previewDoc(url: string, name: string, signedDoc: boolean) {
    let isRemit = false;
    this.cadData.assignedLoan.forEach((d) => {
      if (d.loan.loanTag === LoanTag.getKeyByValue(LoanTag.REMIT_LOAN)) {
        isRemit = true;
      }
    });
    if (!ObjectUtil.isEmpty(url)) {
      if (signedDoc && (name === LaxmiOfferLetterConst.value(LaxmiOfferLetterConst.PERSONAL_GUARANTEE) ||
          name === LaxmiOfferLetterConst.value(LaxmiOfferLetterConst.LETTER_OF_COMMITMENT)) && isRemit) {
        this.commonService.openDocuments(url);
      } else {
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = `${ApiConfig.URL}/${url}?${Math.floor(Math.random() * 100) + 1}`;
        link.setAttribute('visibility', 'hidden');
        link.click();
      }
    }
  }

  populateCadTemplate(documentId, loanId) {
    this.nbDialogService.open(CadChecklistDocTemplateModalComponent, {
      context: {
        documentId: documentId,
        cadData: this.cadData,
        customerLoanId: loanId
      }
    });
  }




}

