import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RequiredDocumentListConst} from '../../../sme-costant/required-document-list-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from "../../../../../../../../@core/utils/ObjectUtil";

@Component({
  selector: 'app-required-legal-document-section',
  templateUrl: './required-legal-document-section.component.html',
  styleUrls: ['./required-legal-document-section.component.scss']
})
export class RequiredLegalDocumentSectionComponent implements OnInit {
  @Input() initialInformation;
  requireDocumentForm: FormGroup;
  legalList = RequiredDocumentListConst.enumObject();
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
