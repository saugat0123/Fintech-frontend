import {Component, OnInit} from '@angular/core';
import {ShareValueFormComponent} from "../share-value-form/share-value-form.component";
import {ModalUtils, ToastService} from "../../../../../@core/utils";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ShareForm} from "../../../modal/shareForm";
import {NepseService} from "../nepse.service";
import {PaginationUtils} from "../../../../../@core/utils/PaginationUtils";
import {Alert, AlertType} from "../../../../../@theme/model/Alert";
import {Pageable} from "../../../../../@core/service/baseservice/common-pageable";

@Component({
  selector: 'app-share-list',
  templateUrl: './share-list.component.html',
  styleUrls: ['./share-list.component.scss']
})
export class ShareListComponent implements OnInit {

  shareDataList: ShareForm[] = [];
  pageable: Pageable = new Pageable();
  page = 1;

  constructor(private modalService: NgbModal,
              private nepseService: NepseService,
              private toastService: ToastService) {
  }

  static loadData(other: ShareListComponent) {

    other.nepseService.getPaginationOrdered(null, other.page, 5).subscribe((response: any) => {
          other.shareDataList = response.detail.content;
          other.pageable = PaginationUtils.getPageable(response.detail);
        }, error => {
          other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Share Data'));
        }
    );

  }

  ngOnInit() {
    ShareListComponent.loadData(this);
  }

  showShareValue() {
    const modal = this.modalService.open(ShareValueFormComponent);
    ModalUtils.resolve(modal.result, ShareListComponent.loadData, this);
  }

  parsedData(value: any) {
    return JSON.parse(value);
  }

  changePage(page: number) {
    this.page = page;

    ShareListComponent.loadData(this);
  }


}
