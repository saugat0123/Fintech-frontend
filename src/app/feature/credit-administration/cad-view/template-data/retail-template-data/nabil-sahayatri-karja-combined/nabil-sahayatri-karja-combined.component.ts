import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-nabil-sahayatri-karja-combined',
  templateUrl: './nabil-sahayatri-karja-combined.component.html',
  styleUrls: ['./nabil-sahayatri-karja-combined.component.scss']
})
export class NabilSahayatriKarjaCombinedComponent implements OnInit {
  @Input() loanName;
  @Input() cadDocAssignedLoan;
  @Input() offerDocumentList;
  @Input() globalBaseRate;
  nabilSahayatriCombinedForm: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.nabilSahayatriCombinedForm = this.formBuilder.group({
      nabilSahayatriCombinedFormArray: this.formBuilder.array([])
    });
  }

}
