import { Component, OnInit } from '@angular/core';
import { Branch } from '../../../modal/branch';
import { CommonService } from '../../../shared-service/baseservice/common-baseservice';
import { Router } from '@angular/router';
import { CommonDataService } from '../../../shared-service/baseservice/common-dataService';
 declare var $;
@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.css']
})
export class AddModelComponent implements OnInit {
  submitted = false;
  spinner: boolean = false;
  globalMsg;
  branch:Branch = new Branch();
  constructor(
    private commonService:CommonService,
    private router: Router,
  private dataService:CommonDataService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
    this.commonService.saveOrEdit(this.branch, 'v1/branch').subscribe(result => {
       $('.add-branch').modal('hide');
       this.globalMsg = "SUCCESSFULLY ADDED BRANCH";
       this.dataService.getGlobalMsg(this.globalMsg);
       $('.global-msgModal').modal('show');
       location.reload();
      
    }, error => {
      $('.add-branch').modal('hide');
      console.log(error)
      this.globalMsg = error.error.message;
      this.dataService.getGlobalMsg(this.globalMsg);
      $('.global-msgModal').modal('show');
    }
    );
  }

}
