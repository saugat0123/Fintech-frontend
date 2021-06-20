import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-letter-of-agreement',
  templateUrl: './letter-of-agreement.component.html',
  styleUrls: ['./letter-of-agreement.component.scss']
})
export class LetterOfAgreementComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;

  letterOfAgreement: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private toastService: ToastService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.letterOfAgreement = this.formBuilder.group({
      offerLetterDate: [undefined],
      letterName: [undefined],
      letterSubject: [undefined],
      bodyContentDate: [undefined],
    });
  }

  submit() {
    console.log(this.letterOfAgreement.value);
  }

}
