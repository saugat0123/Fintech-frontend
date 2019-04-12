import {Component, DoCheck, OnInit} from '@angular/core';
import {LoanTemplate} from '../../../../../../modal/template';
import {CommonService} from '../../../../../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../../shared-service/baseservice/common-dataService';

declare var $;

@Component({
  selector: 'app-template-add-model',
  templateUrl: './template-add-model.component.html',
  styleUrls: ['./template-add-model.component.css']
})
export class TemplateAddModelComponent implements OnInit, DoCheck {
  task: string;
  submitted = false;
  spinner: boolean = false;
  globalMsg;
  loanTemplate: LoanTemplate = new LoanTemplate;

  constructor(
      private commonService: CommonService,
      private router: Router,
      private dataService: CommonDataService) {
  }

  ngOnInit() {

  }

  ngDoCheck(): void {
    if (this.dataService.getData() === undefined) {
      this.task = 'Add';
    } else {
      this.loanTemplate = this.dataService.getData();
      if (this.loanTemplate.id !== undefined) {
        this.task = 'Edit';
      } else {
        this.task = 'Add';
      }

    }

  }

  onSubmit() {
    this.submitted = true;
    // this.branch.created=null;
    this.commonService.saveOrEdit(this.loanTemplate, 'v1/loanTemplate').subscribe(result => {
          $('#addLoanModal').modal('hide');
          if (this.loanTemplate.id == null) {
            this.globalMsg = 'SUCCESSFULLY ADDED loan Template';
          } else {
            this.globalMsg = 'SUCCESSFULLY EDITED loan Template';
          }

          this.dataService.getGlobalMsg(this.globalMsg);
          this.dataService.getAlertMsg('true');
          this.loanTemplate = new LoanTemplate;
          this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
              this.router.navigate(['home/template']));
          this.dataService.alertmsg();


        }, error => {

          $('#addLoanModal').modal('hide');

          this.globalMsg = error.error.message;
          this.dataService.getGlobalMsg(this.globalMsg);
          this.dataService.getAlertMsg('false');

          this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
              this.router.navigate(['home/branch']));
          this.dataService.alertmsg();

        }
    );
  }

}
