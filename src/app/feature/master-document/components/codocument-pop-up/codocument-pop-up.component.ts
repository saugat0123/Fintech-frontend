import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MasterDoc} from '../../model/master-doc';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {CoDocService} from '../../service/co-doc.service';
import {CoDoc} from '../../model/co-doc';

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
  coDoc: CoDoc = new CoDoc();

  constructor(private formBuilder: FormBuilder,
              private coDocService: CoDocService) { }



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
    this.coDoc.docData = JSON.stringify(this.coDocForm.value);
    this.coDoc.docName = this.masterDoc.docName;
    this.coDoc.docPath = this.masterDoc.docPath;
    this.coDoc.bookmarks = this.masterDoc.mdocData;
    this.coDoc.customerType = this.masterDoc.customerType;
    this.coDoc.docStatus = this.masterDoc.status;
    this.coDocService.create(this.coDoc).subscribe(res => {
      console.log(res.detail);
    }, error => {
      console.error(error);
    });
    console.log(this.coDocForm.value);
  }

}
