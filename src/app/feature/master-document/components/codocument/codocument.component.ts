import { Component, OnInit } from '@angular/core';
import {MasterDocService} from '../../service/master-doc.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {ToastService} from '../../../../@core/utils';
import {NbDialogService} from '@nebular/theme';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {MasterDoc} from '../../model/master-doc';
import {LoanConfig} from '../../../admin/modal/loan-config';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {CoDoc} from '../../model/co-doc';
import {CodocumentPopUpComponent} from '../codocument-pop-up/codocument-pop-up.component';

@Component({
  selector: 'app-codocument',
  templateUrl: './codocument.component.html',
  styleUrls: ['./codocument.component.scss']
})
export class CodocumentComponent implements OnInit {
  page = 1;
  pageable: Pageable = new Pageable();
  masterDocList: Array<MasterDoc> = new Array<MasterDoc>();
  coDoc: CoDoc = new CoDoc();
  search = {
    docName: undefined
  };
  filterForm: FormGroup = new FormGroup({});
  isFilterCollapsed = true;
  loanConfigList: Array<LoanConfig> = new Array<LoanConfig>();
  bookmarkList: Array<string> = new Array<string>();
  spinner = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private masterDocumentService: MasterDocService,
              private loanConfigService: LoanConfigService,
              private toasterService: ToastService,
              private nbDialogService: NbDialogService) { }

  static loadData(other: CodocumentComponent) {
    other.masterDocumentService.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
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
