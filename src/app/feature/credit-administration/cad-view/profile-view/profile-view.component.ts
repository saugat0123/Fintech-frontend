import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {
  @Input()
  cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input()
  customerInfoData: CustomerInfoData;
  cadDocumentId;
  spinner = false;
  currentUserLocalStorage = LocalStorageUtil.getStorage().userId;
  @Input()
  toggleArray: { toggled: boolean }[];
  constructor() { }

  ngOnInit() {
  }

}
