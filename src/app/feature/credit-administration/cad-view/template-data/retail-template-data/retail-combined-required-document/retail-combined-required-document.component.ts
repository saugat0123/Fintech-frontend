import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RequiredDocumentListConst} from '../../nabil-sme-template-data/sme-costant/required-document-list-const';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {RetailRequiredDocumentList} from '../retail-const/retail-required-document-list-const';

@Component({
  selector: 'app-retail-combined-required-document',
  templateUrl: './retail-combined-required-document.component.html',
  styleUrls: ['./retail-combined-required-document.component.scss']
})
export class RetailCombinedRequiredDocumentComponent implements OnInit {
  @Input() initialInformation;
  requireDocumentForm: FormGroup;
  legalList = RetailRequiredDocumentList.enumObject();
  legalDocuments;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.initialInformation)) {
      if (!ObjectUtil.isEmpty(this.initialInformation.requiredDocuments)) {
        this.legalDocuments = this.initialInformation.requiredDocuments.requiredLegalDocument.requiredDocument;
      }
      if (!ObjectUtil.isEmpty(this.initialInformation.requiredLegalDocument)) {
        this.legalDocuments = this.initialInformation.requiredLegalDocument.requiredDocument;
      }
    }
    if (!ObjectUtil.isEmpty(this.legalDocuments)) {
      this.requireDocumentForm.patchValue({
        requiredDocument: this.legalDocuments
      });
    }
  }

  buildForm() {
    this.requireDocumentForm = this.formBuilder.group({
      requiredDocument: [undefined],
    });
  }


}
