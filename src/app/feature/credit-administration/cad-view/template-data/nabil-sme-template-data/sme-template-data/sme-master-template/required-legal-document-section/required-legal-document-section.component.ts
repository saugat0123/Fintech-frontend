import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RequiredDocumentListConst} from '../../../sme-costant/required-document-list-const';

@Component({
  selector: 'app-required-legal-document-section',
  templateUrl: './required-legal-document-section.component.html',
  styleUrls: ['./required-legal-document-section.component.scss']
})
export class RequiredLegalDocumentSectionComponent implements OnInit {
  requireDocumentForm: FormGroup;
  legalList = RequiredDocumentListConst.enumObject();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.requireDocumentForm = this.formBuilder.group({
      requiredDocument: [undefined],
    });
  }

}
