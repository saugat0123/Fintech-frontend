import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-assignment-of-receivable',
  templateUrl: './assignment-of-receivable.component.html',
  styleUrls: ['./assignment-of-receivable.component.scss']
})
export class AssignmentOfReceivableComponent implements OnInit {

  assignmentOfReceivable: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  buildForm(){
    this.assignmentOfReceivable = this.formBuilder.group({
      address: [undefined],
      department: [undefined],
      officeName: [undefined],
      regNo: [undefined],
      regDate: [undefined],
      metropolitan1: [undefined],
      wardNo: [undefined],
      partnershipForm: [undefined],
      representativeName: [undefined],
      representativeGrandaughterName: [undefined],
      sonOrDaughter: [undefined],
      wife: [undefined],
      district: [undefined],
      metropolitan2: [undefined],
      age: [undefined],
      mrOrMrs: [undefined],
      ownerBankNum: [undefined],
      documentWritenDate: [undefined],
      rupees: [undefined],
      rupessInWord: [undefined],
      sambatYear: [undefined],
      sambatMonth: [undefined],
      sambatDay: [undefined],
      sambatDocumentWrittenInWord: [undefined],
      witnessSignature: [undefined],
      witnessDistrict: [undefined],
      witnessMunicipality: [undefined],
      witnessVdc: [undefined],
      witnessAge: [undefined],
      witnessEvidence: [undefined],
    });
  }

  submit() {
    console.log(this.assignmentOfReceivable.value);
  }

}
