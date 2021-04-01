import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-previous-comments',
  templateUrl: './previous-comments.component.html',
  styleUrls: ['./previous-comments.component.scss']
})
export class PreviousCommentsComponent implements OnInit {
  form: FormGroup;
  @Output() previousCommentEmitter = new EventEmitter();
  @Input() data;
  customerInfo: CustomerInfoData;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.data)) {
      const formData = JSON.parse(this.data);
      this.form.patchValue(formData);
    }
    console.log('Form Value', this.form.value);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      previousComments: [undefined],
      auditorComments: [undefined],
    });
  }

  public submit() {
    this.customerInfo.data = JSON.stringify(this.form.value);
    this.previousCommentEmitter.emit(this.customerInfo.data);
  }

}
