import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MasterDocService} from '../../service/master-doc.service';
import {ToastService} from '../../../../@core/utils';
import {MasterDoc} from '../../model/master-doc';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {LoanConfig} from '../../../admin/modal/loan-config';
import {NbDialogService} from '@nebular/theme';
import {BookmarkPopUpComponent} from '../bookmark-pop-up/bookmark-pop-up.component';
import {CodocumentPopUpComponent} from '../codocument-pop-up/codocument-pop-up.component';

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
  loanConfigList: Array<LoanConfig> = new Array<LoanConfig>();
  bookmarkList: Array<string> = new Array<string>();

  constructor(private formBuilder: FormBuilder,
              private masterDocumentService: MasterDocService,
              private loanConfigService: LoanConfigService,
              private toasterService: ToastService,
              private nbDialogService: NbDialogService) { }

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
    this.getAllLoanConfigList();
    MasterDocumentComponent.loadData(this);
    this.buildFilterForm();
    this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.docForm = this.formBuilder.group({
      file: [undefined, Validators.required],
      docName: [undefined, Validators.required],
      customerType: [undefined, Validators.required],
      loanData: [undefined],
    });
  }

  private buildFilterForm(): FormGroup {
    return this.filterForm = this.formBuilder.group({
      docName: [undefined],
    });
  }

  private getAllLoanConfigList(): void {
    this.loanConfigService.getAll().subscribe(res => {
      this.loanConfigList = res.detail;
    }, error => {
      console.error(error);
      this.toasterService.show(new Alert(AlertType.DANGER, 'Error while getting loan list'));
    });
  }

  public onDocChose(event: any): void {
    this.file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', this.file);
    this.masterDocumentService.getAllBookmarks(formData).subscribe(res => {
      this.bookmarkList = res.detail;
    }, error => {
      console.error(error);
    });
  }

  public submit() {
    this.spinner = true;
    this.submitted = true;
    if (this.docForm.invalid) {
      this.toasterService.show(new Alert(AlertType.WARNING, 'Please check validation'));
      return;
    }
    const formData = new FormData();

    if (!ObjectUtil.isEmpty(this.file)) {
      formData.append('file', this.file);
    }
    if (!ObjectUtil.isEmpty(this.docForm.get('loanData').value)) {
      formData.append('loanData', this.docForm.get('loanData').value);
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

  public onSubmit(): void {
    let context;
    context = {
      bookmarks: this.bookmarkList,
    };
    const componentRef = this.nbDialogService.open(BookmarkPopUpComponent, {
      context,
      closeOnBackdropClick: false,
      hasBackdrop: false,
      hasScroll: true,
    });
    componentRef.onClose.subscribe(res => {
      if (res === 'YES') {
        this.submit();
      }
    });
    componentRef.onClose.subscribe(res => {
      if (res === 'NO') {
        this.buildForm();
      }
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

  onDelete(id: number) {
    this.spinner = true;
    this.masterDocumentService.delete(id).subscribe(res => {
      this.toasterService.show(new Alert(AlertType.SUCCESS, 'Successfully deleted file'));
      MasterDocumentComponent.loadData(this);
      this.spinner = false;
    }, error => {
      this.spinner = false;
      console.error(error);
      this.toasterService.show(new Alert(AlertType.DANGER, 'Unable to delete file'));
    });
  }

  changePage(page: number) {
    this.page = page;
    MasterDocumentComponent.loadData(this);
  }

  onSaveGenerate(masterDoc: any) {
    let context;
    context = {
      masterDoc: masterDoc,
    };
    this.nbDialogService.open(CodocumentPopUpComponent, {
      context,
    });
  }

}
