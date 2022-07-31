import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../../@core/utils';
import {NbDialogService} from '@nebular/theme';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {CoDoc} from '../../model/co-doc';
import {CoDocService} from '../../service/co-doc.service';

@Component({
  selector: 'app-codocument',
  templateUrl: './codocument.component.html',
  styleUrls: ['./codocument.component.scss']
})
export class CodocumentComponent implements OnInit {
  page = 1;
  pageable: Pageable = new Pageable();
  coDocList: Array<CoDoc> = new Array<CoDoc>();
  coDoc: CoDoc = new CoDoc();
  search = {
    docName: undefined
  };
  filterForm: FormGroup = new FormGroup({});
  isFilterCollapsed = true;
  spinner = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private toasterService: ToastService,
              private nbDialogService: NbDialogService,
              private coDocService: CoDocService) { }

  static loadData(other: CodocumentComponent) {
    other.coDocService.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
      other.coDocList = response.detail.content;
      other.pageable = PaginationUtils.getPageable(response.detail);
      other.spinner = false;
    }, error => {
      console.error(error);
      other.toasterService.show(new Alert(AlertType.ERROR, 'Unable to Load Master Document Data!!!'));
      other.spinner = false;
    });
  }

  ngOnInit() {
    CodocumentComponent.loadData(this);
    this.buildFilterForm();
  }

  private buildFilterForm(): FormGroup {
    return this.filterForm = this.formBuilder.group({
      docName: [undefined],
    });
  }

  onSearch() {
    this.search.docName = ObjectUtil.isEmpty(this.filterForm.get('docName').value) ? undefined : this.filterForm.get('docName').value;
    CodocumentComponent.loadData(this);
  }

  clear() {
    this.buildFilterForm();
    this.onSearch();
    CodocumentComponent.loadData(this);
  }

  changePage(page: number) {
    this.page = page;
    CodocumentComponent.loadData(this);
  }

  deleteCoDoc(coDoc: CoDoc) {
    this.coDocService.deleteCoDoc(coDoc).subscribe(res => {
      this.toasterService.show(new Alert(AlertType.SUCCESS, 'Co document deleted successfully'));
      CodocumentComponent.loadData(this);
    }, error => {
      console.error(error);
      this.toasterService.show(new Alert(AlertType.DANGER, 'Unable to delete co document'));
    });
  }
}
