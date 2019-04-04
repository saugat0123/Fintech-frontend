import {Component, DoCheck, OnInit} from '@angular/core';
import {Nepse} from '../../../../modal/nepse';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {Company} from '../../../../modal/company';

declare var $;
@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css']
})
export class AddCompanyComponent implements OnInit, DoCheck {

  task: string;
  submitted = false;
  spinner: boolean = false;
  globalMsg;
  company: Company = new Company();
  constructor(
      private commonService: CommonService,
      private router: Router,
      private dataService: CommonDataService
  ) { }

  ngOnInit() {
  }
  ngDoCheck(): void {
    this.company = this.dataService.getCompany();
    if (this.company.id == null) {
      this.task = 'Add';
    } else { this.task = 'Edit'; }

  }

  onSubmit() {
    this.submitted = true;
    this.commonService.saveOrEdit(this.company, 'v1/company').subscribe(result => {
          console.log(this.company);
          $('.add-company').modal('hide');
          if (this.company.id == null) {
            this.globalMsg = "SUCCESSFULLY ADDED COMPANY";
          } else {
            this.globalMsg = "SUCCESSFULLY EDITED COMPANY";
          }

          this.dataService.getGlobalMsg(this.globalMsg);
          this.dataService.getAlertMsg('true');
          this.company = new Company();
          this.router.navigateByUrl('home/dashboard', { skipLocationChange: true }).then(() =>
              this.router.navigate(['home/company']));
          $('.alert-custom').slideDown();



        }, error => {

          $('.add-company').modal('hide');

          this.globalMsg = error.error.message;
          this.dataService.getGlobalMsg(this.globalMsg);
          this.dataService.getAlertMsg('false');

          this.router.navigateByUrl('home/dashboard', { skipLocationChange: true }).then(() =>
              this.router.navigate(["home/company"]));
          $(".alert-custom").slideDown();

        }
    );
  }

}
