import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PreviousSecurity} from '../../admin/modal/previousSecurity';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Comments} from '../../admin/modal/comments';

@Component({
  selector: 'app-previous-security',
  templateUrl: './previous-security.component.html',
  styleUrls: ['./previous-security.component.scss']
})
export class PreviousSecurityComponent implements OnInit {
  @Input() securityDataResponse: PreviousSecurity;
  @Input() securityData: any;
  @Input() fromProfile;
  @Output() securityDataEmitter = new EventEmitter();
  @Input() commentData;
  ckeConfig;
  submitted = false;
  previousSecurityFormGroup: FormGroup;
  securityDataObject = new Comments();


  constructor( private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    const commentsForEdit = JSON.parse(this.commentData);
    const comment = JSON.parse(commentsForEdit.data);
    if ( !ObjectUtil.isEmpty(this.securityData)) {
        const securityForEdit = JSON.parse(this.securityData);
        this.setFormData(securityForEdit.data);
    }
  }
  buildForm() {
    this.previousSecurityFormGroup = this.formBuilder.group({
      securityDetails: [undefined],
      previousComments: [undefined],
      auditorComments: [undefined],
    });

  }

  public setFormData(formData): void {
    if (!ObjectUtil.isEmpty(formData)) {
      const parseData = JSON.parse(formData);
      this.previousSecurityFormGroup.patchValue(parseData);
    }
  }

  submitForm() {
    this.submitted = true;
    if (!ObjectUtil.isEmpty(this.securityDataResponse)) {
      this.securityDataObject = this.securityDataResponse;
    }
    this.securityDataObject.data = JSON.stringify(this.previousSecurityFormGroup.value);
    this.securityDataEmitter.emit(this.securityDataObject);
  }
}
