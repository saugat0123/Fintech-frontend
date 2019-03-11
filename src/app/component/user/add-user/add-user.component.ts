import { Component, OnInit, DoCheck } from '@angular/core';
import { User } from '../../../modal/User';
import { CommonService } from '../../../shared-service/baseservice/common-baseservice';
import { Router } from '@angular/router';
import { CommonDataService } from '../../../shared-service/baseservice/common-dataService';
declare var $;

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  task:string;
  submitted = false;
  spinner: boolean = false;
  globalMsg;
  user:User = new User();
  constructor(
    private commonService:CommonService,
    private router: Router,
  private dataService:CommonDataService) { }

  ngOnInit() {
  
  }

  ngDoCheck(): void {
    this.user = this.dataService.getUser();
    if(this.user.id==null){
      this.task='Add';
    }else{this.task='Edit';}
    
  }

  onSubmit() {
    this.submitted = true;
    this.commonService.saveOrEdit(this.user, 'v1/user').subscribe(result => {
       $('.add-user').modal('hide');
       if(this.user.id==null){
        this.globalMsg = "SUCCESSFULLY ADDED USER";
       }else{
        this.globalMsg = "SUCCESSFULLY EDITED USER";
       }
       
       this.dataService.getGlobalMsg(this.globalMsg);
       this.dataService.getAlertMsg('true');
       this.user = new User();
       this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(()=>
this.router.navigate(["home/user"])); 
$(".alert-custom").slideDown();

     
      
    }, error => {
      
      $('.add-user').modal('hide');
      
      this.globalMsg = error.error.message;
      this.dataService.getGlobalMsg(this.globalMsg);
      this.dataService.getAlertMsg('false');
      
      this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(()=>
      this.router.navigate(["home/user"])); 
      $(".alert-custom").slideDown();
      
    }
    );
  }

}

