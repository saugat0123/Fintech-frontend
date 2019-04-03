import { Component, OnInit, DoCheck } from '@angular/core';
import { User } from '../../../modal/user';
import { CommonService } from '../../../shared-service/baseservice/common-baseservice';
import { Router } from '@angular/router';
import { CommonDataService } from '../../../shared-service/baseservice/common-dataService';
import { UserType } from '../../../modal/user-type';
import {FileUploader} from 'ng2-file-upload';
declare var $;

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit, DoCheck {
  task: string;
  submitted = false;
  spinner: boolean = false;
  globalMsg;
  user: User = new User();
  url: any = 'http://localhost:8086/v1/user/uploadProfile';
  constructor(
    private commonService: CommonService,
    private router: Router,
    private dataService: CommonDataService) { }

  public signatureUploader: FileUploader = new FileUploader({url: 'v1/user/uploadSignature', itemAlias: 'photo'});
  public imageUploader: FileUploader = new FileUploader({url: this.url, itemAlias: 'photo'});

  ngOnInit() {
    this.signatureUploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.signatureUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('FileUpload:uploaded:', item, status, response);
      alert('File uploaded successfully');
    };
    this.imageUploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.imageUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('FileUpload:uploaded:', item, status, response);
      alert('File uploaded successfully');
    };
  }

  ngDoCheck(): void {
    this.user = this.dataService.getUser();
    if (this.user.id == null) {
      this.task = 'Add';
    } else { this.task = 'Edit'; }

  }

  onSubmit() {
    this.submitted = true;
    console.log(this.user);
    this.imageUploader.uploadAll();
    this.signatureUploader.uploadAll();
    this.commonService.saveOrEdit(this.user, 'v1/user').subscribe(result => {
      $('.add-user').modal('hide');
      if (this.user.id == null) {
        this.globalMsg = "SUCCESSFULLY ADDED USER";
      } else {
        this.globalMsg = "SUCCESSFULLY EDITED USER";
      }

      this.dataService.getGlobalMsg(this.globalMsg);
      this.dataService.getAlertMsg('true');
      this.user = new User();
      this.router.navigateByUrl('home/dashboard', { skipLocationChange: true }).then(() =>
        this.router.navigate(["home/user"]));
      $(".alert-custom").slideDown();



    }, error => {

      $('.add-user').modal('hide');

      this.globalMsg = error.error.message;
      this.dataService.getGlobalMsg(this.globalMsg);
      this.dataService.getAlertMsg('false');

      this.router.navigateByUrl('home/dashboard', { skipLocationChange: true }).then(() =>
        this.router.navigate(["home/user"]));
      $(".alert-custom").slideDown();

    }
    );
  }

}

