import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ExcelOfferLetterConst} from '../../../../cad-documents/cad-document-core/excel-offer-letter/excel-offer-letter-const';
import {NbDialogRef} from '@nebular/theme';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';

@Component({
  selector: 'app-dp-note-guarantor',
  templateUrl: './dp-note-guarantor.component.html',
  styleUrls: ['./dp-note-guarantor.component.scss']
})
export class DpNoteGuarantorComponent implements OnInit {

  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  spinner;
  form: FormGroup;
  offerLetterConst = ExcelOfferLetterConst;
  initialInfoPrint;


  constructor(
      private dialogRef: NbDialogRef<DpNoteGuarantorComponent>,
      private formBuilder: FormBuilder,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
  ) {
  }

  ngOnInit() {
  }

}
