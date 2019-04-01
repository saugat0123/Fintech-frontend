import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {Province} from '../../../../modal/province';
import {Segment} from '../../../../modal/segment';

declare var $;
@Component({
  selector: 'app-add-province',
  templateUrl: './add-province.component.html',
  styleUrls: ['./add-province.component.css']
})
export class AddProvinceComponent implements OnInit, DoCheck {

  task: string;
  submitted = false;
  spinner: boolean = false;
  globalMsg;
  province: Province = new Province();
  constructor(
      private commonService: CommonService,
      private router: Router,
      private dataService: CommonDataService
  ) { }
  ngOnInit() {
  }

  ngDoCheck(): void {
    this.province = this.dataService.getProvince();
    if (this.province.id == null) {
      this.task = 'Add';
    } else { this.task = 'Edit'; }

  }

  onSubmit() {
    this.submitted = true;
    this.commonService.saveOrEdit(this.province, 'v1/address/province').subscribe(result => {
          console.log(this.province);
          $('.add-province').modal('hide');
          if (this.province.id == null) {
            this.globalMsg = "SUCCESSFULLY ADDED BRANCH";
          } else {
            this.globalMsg = "SUCCESSFULLY EDITED BRANCH";
          }

          this.dataService.getGlobalMsg(this.globalMsg);
          this.dataService.getAlertMsg('true');
          this.province = new Province();
          this.router.navigateByUrl('home/dashboard', { skipLocationChange: true }).then(() =>
              this.router.navigate(['home/province']));
          $('.alert-custom').slideDown();



        }, error => {

          $('.add-province').modal('hide');

          this.globalMsg = error.error.message;
          this.dataService.getGlobalMsg(this.globalMsg);
          this.dataService.getAlertMsg('false');

          this.router.navigateByUrl('home/dashboard', { skipLocationChange: true }).then(() =>
              this.router.navigate(["home/province"]));
          $(".alert-custom").slideDown();

        }
    );
  }

}
