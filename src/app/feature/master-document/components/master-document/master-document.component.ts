import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MasterDocService} from '../../service/master-doc.service';
import {ToastService} from '../../../../@core/utils';
import {MasterDoc} from '../../../loan-update/component/model/master-doc';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-master-document',
  templateUrl: './master-document.component.html',
  styleUrls: ['./master-document.component.scss']
})
export class MasterDocumentComponent implements OnInit {
  docForm: FormGroup = new FormGroup({});
  mDoc: MasterDoc = new MasterDoc();
  file: any;
  spinner = false;
  submitted = false;
  page = 1;
  pageable: Pageable = new Pageable();
  masterDocList: Array<MasterDoc> = new Array<MasterDoc>();
  search = {
    docName: undefined
  };
  filterForm: FormGroup = new FormGroup({});
  isFilterCollapsed = true;
  isEdit = false;

  constructor(private formBuilder: FormBuilder,
              private masterDocumentService: MasterDocService,
              private toasterService: ToastService) { }

  static loadData(other: MasterDocumentComponent) {
    other.masterDocumentService.getPaginationWithSearchObject(other.search, other.page, 10).subscribe(response => {
      other.masterDocList = response.detail.content;
      other.pageable = PaginationUtils.getPageable(response.detail);
      other.spinner = false;
    }, error => {
      console.error(error);
      other.toasterService.show(new Alert(AlertType.ERROR, 'Unable to Load Master Document Data!!!'));
      other.spinner = false;
    });
  }

  ngOnInit() {
    MasterDocumentComponent.loadData(this);
    this.buildFilterForm();
    this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.docForm = this.formBuilder.group({
      file: [undefined, Validators.required],
      docName: [undefined, Validators.required],
      customerType: [undefined, Validators.required],
    });
  }

  private buildFilterForm(): FormGroup {
    return this.filterForm = this.formBuilder.group({
      docName: [undefined],
    });
  }

  public onDocChose(event: any): void {
    this.file = event.target.files[0];
  }

  public onDocUpload(): void {
    this.spinner = true;
    this.submitted = true;
    if (this.docForm.invalid) {
      this.toasterService.show(new Alert(AlertType.WARNING, 'Please check validation'));
      return;
    }
    const formData = new FormData();
    if (!ObjectUtil.isEmpty(this.mDoc.id)) {
      formData.append('docId', this.mDoc.id.toString());
      formData.append('isEdit', 'YES');
    }
    if (!ObjectUtil.isEmpty(this.file)) {
      formData.append('file', this.file);
    }
    formData.append('docName', this.docForm.get('docName').value);
    formData.append('customerType', this.docForm.get('customerType').value);
    this.masterDocumentService.upload(formData).subscribe(res => {
      this.toasterService.show(new Alert(AlertType.SUCCESS, 'Successfully uploaded document'));
      this.spinner = false;
      this.submitted = false;
      this.docForm.reset();
      MasterDocumentComponent.loadData(this);
    }, error => {
      this.spinner = false;
      this.submitted = false;
      console.error(error);
      this.toasterService.show(new Alert(AlertType.DANGER, 'Error while uploading file'));
    });
  }

  onSearch() {
    this.search.docName = ObjectUtil.isEmpty(this.filterForm.get('docName').value) ? undefined : this.filterForm.get('docName').value;
    MasterDocumentComponent.loadData(this);
  }

  clear() {
    this.buildFilterForm();
    this.onSearch();
    MasterDocumentComponent.loadData(this);
  }

  onEdit(masterDoc: MasterDoc) {
    this.isEdit = true;
    this.mDoc = masterDoc;
    this.removeValidationOnEdit();
    this.docForm.patchValue(this.mDoc);
  }


  removeValidationOnEdit() {
    this.docForm.get('file').setValidators(null);
    this.docForm.get('file').updateValueAndValidity();
  }

}
