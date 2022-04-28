import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {NgxSpinnerService} from 'ngx-spinner';
import {Editor} from '../../../@core/utils/constants/editor';
import {ToastService} from '../../../@core/utils';

@Component({
  selector: 'app-swot-analysis',
  templateUrl: './swot-analysis.component.html',
  styleUrls: ['./swot-analysis.component.scss']
})
export class SwotAnalysisComponent implements OnInit {
  @Input() companyInfo;
  @Input() swotData;
  @Input() fromProfile: boolean;
  @Output() swotAnalysisDataEmitter = new EventEmitter();
  swotAnalysisForm: FormGroup;
  submitted = false;
  ckeConfig = Editor.CK_CONFIG;
  submitData;
  tempData;

  constructor(private formBuilder: FormBuilder,
              private overlay: NgxSpinnerService) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.swotData)) {
      this.tempData = JSON.parse(this.swotData);
      this.swotAnalysisForm.patchValue(this.tempData);
    }
  }

  buildForm() {
    this.swotAnalysisForm = this.formBuilder.group({
      strength: [undefined],
      weakness: [undefined],
      opportunity: [undefined],
      threats: [undefined],
    });
  }

  get form() {
    return this.swotAnalysisForm.controls;
  }

  onSubmit() {
    this.overlay.show();
    this.submitted = true;
    if (!ObjectUtil.isEmpty(this.swotData)) {
      this.submitData = this.swotData;
    }
    this.submitData = JSON.stringify(this.swotAnalysisForm.value);
    this.swotAnalysisDataEmitter.emit(this.submitData);
    this.overlay.hide();
  }

}
