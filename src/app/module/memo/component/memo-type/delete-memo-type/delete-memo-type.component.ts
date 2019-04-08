import {Component, DoCheck, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CommonService} from "../../../../../shared-service/baseservice/common-baseservice";
import {CommonDataService} from "../../../../../shared-service/baseservice/common-dataService";

declare var $;
@Component({
  selector: 'app-delete-memo-type',
  templateUrl: './delete-memo-type.component.html',
  styleUrls: ['./delete-memo-type.component.css']
})
export class DeleteMemoTypeComponent implements OnInit, DoCheck {

  modalData: any = {};
  data: any;
  currentUrl: any;
  currentApi: any;
  globalMsg;

  constructor(
      private router: Router,
      private commonService: CommonService,
      private dataService: CommonDataService
  ) { }

  ngOnInit() {
    this.modalData = {
      "name": "Memo Type"
    };

    this.currentApi = "v1/memos/types";
  }

  ngDoCheck(): void {
    this.currentUrl = this.router.url;
    if (this.dataService.getData() != null) {
      this.data = this.dataService.getData();
    }
  }

  deleteClick() {
    this.commonService.deleteById(this.currentApi + "/" + this.data.id).subscribe(result => {

        this.globalMsg = "SUCCESSFULLY DELETED MEMO TYPE";
        this.dataService.getGlobalMsg(this.globalMsg);
        this.dataService.getAlertMsg('true');

        $(".alert-custom").slideDown();

        this.router.navigateByUrl('home/dashboard', { skipLocationChange: true }).then(e => {
          if (e) {
            this.router.navigate([this.currentUrl]);

          }
        });


      }, error => {
        this.globalMsg = error.error.message;
        this.dataService.getGlobalMsg(this.globalMsg);
        this.dataService.getAlertMsg('false');
        $(".alert-custom").slideDown();

      }
  );

  }

  reloadPage() {
    this.router.navigateByUrl('home/dashboard', { skipLocationChange: true }).then(e => {
      if (e) {
        this.router.navigate([this.currentUrl]);

      }
    });
  }

}
