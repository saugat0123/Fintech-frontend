import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MasterDoc} from '../../model/master-doc';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {CoDocService} from '../../service/co-doc.service';
import {CoDoc} from '../../model/co-doc';
import {NbDialogRef} from '@nebular/theme';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';

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
  spinner = false;

  constructor(private formBuilder: FormBuilder,
              private coDocService: CoDocService,
              private nbDialogRef: NbDialogRef<CodocumentPopUpComponent>,
              private toasterService: ToastService) { }



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
    this.spinner = true;
    this.coDoc.docData = JSON.stringify(this.coDocForm.value);
    this.coDoc.docName = this.masterDoc.docName;
    this.coDoc.docPath = this.masterDoc.docPath;
    this.coDoc.bookmarks = this.masterDoc.mdocData;
    this.coDoc.customerType = this.masterDoc.customerType;
    this.coDoc.docStatus = this.masterDoc.status;
    this.coDocService.create(this.coDoc).subscribe(res => {
      this.toasterService.show(new Alert(AlertType.SUCCESS, 'Document created successfully'));
      this.nbDialogRef.close('CLOSE');
    }, error => {
      this.spinner = false;
      this.toasterService.show(new Alert(AlertType.DANGER, 'Error while creating document'));
      console.error(error);
    });
  }

}
