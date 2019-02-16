import { Component, OnInit, DoCheck } from '@angular/core';
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
export class AddModelComponent implements OnInit,DoCheck {
  task:string;
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

  ngDoCheck(): void {
    this.branch = this.dataService.getBranch();
    if(this.branch.id==null){
      this.task='Add';
    }else{this.task='Edit';}
    
  }

  onSubmit() {
    this.submitted = true;
   // this.branch.created=null;
    this.commonService.saveOrEdit(this.branch, 'v1/branch').subscribe(result => {
       $('.add-branch').modal('hide');
       this.globalMsg = "SUCCESSFULLY ADDED BRANCH";
       this.dataService.getGlobalMsg(this.globalMsg);
       $('.global-msgModal-success').modal('show');
     
      
    }, error => {
      
      $('.add-branch').modal('hide');
      
      this.globalMsg = error.error.message;
      this.dataService.getGlobalMsg(this.globalMsg);
      $('.global-msgModal').modal('show');
    }
    );
  }

}
