import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MasterDoc} from '../../model/master-doc';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-codocument-pop-up',
  templateUrl: './codocument-pop-up.component.html',
  styleUrls: ['./codocument-pop-up.component.scss']
})
export class CodocumentPopUpComponent implements OnInit {
  @Input() masterDoc: MasterDoc;
  coDocForm: FormGroup = new FormGroup({});
  allBookmarks: Array<string> = new Array<string>();
  controls = [];

  constructor(private formBuilder: FormBuilder) { }



  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.masterDoc.mdocData)) {
      const data = JSON.parse(this.masterDoc.mdocData);
      this.allBookmarks = [...data];
      if (this.allBookmarks.length > 0) {
        this.allBookmarks.filter(v => {
          this.controls.push({label: v, controlName: v});
        });
      }
      this.buildForm();
    }
  }

  buildForm() {
    for (const control of this.controls) {
      this.coDocForm.addControl(control.controlName, this.formBuilder.control(undefined));
    }
  }

  onSubmit() {
    console.log(this.coDocForm.value);
  }

}
