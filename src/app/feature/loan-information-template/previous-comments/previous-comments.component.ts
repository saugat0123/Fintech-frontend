import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Comments} from '../../loan/model/comments';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ToastService} from '../../../@core/utils';

@Component({
  selector: 'app-previous-comments',
  templateUrl: './previous-comments.component.html',
  styleUrls: ['./previous-comments.component.scss']
})
export class PreviousCommentsComponent implements OnInit {
  form: FormGroup;
  @Output() previousCommentEmitter = new EventEmitter();
  @Input() formData: Comments;
  @Input() data;
  comments: Comments = new Comments();
  submitted = false;
  customerInfo: CustomerInfoData;
  commentsArray: Array<Comments> = new Array<Comments>();
  constructor(private formBuilder: FormBuilder,
              private el: ElementRef,
              private toastService: ToastService) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.data)) {
      this.comments = this.formData;
      const formData = JSON.parse(this.data);
      this.form.patchValue(formData);
    }
  }
  buildForm() {
    this.form = this.formBuilder.group({
      previousComments: [undefined],
      auditorComments: [undefined],
    });
  }
  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
        'form .ng-invalid'
    );
  }
    onSubmit(form: any) {
      console.log('Form value', this.form.value);
      this.comments.data = JSON.stringify(form.value.previousComments);
      this.comments.data = JSON.stringify(form.value.auditorComments);
      this.previousCommentEmitter.emit(this.comments);
      if (form.value.previousComments !== null) {
     this.commentsArray.push(this.comments);
      }
      if (form.value.auditorComments !== null) {
        this.commentsArray.push(this.comments);
      }
      this.submitted = true;
      if (this.form.invalid) {
        this.scrollToFirstInvalidControl();
        this.toastService.show(new Alert(AlertType.ERROR, 'All fields are mandatory!'));
        return;
      }
    }
}

