import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DocumentFormComponent} from '../../document/document-form/document-form.component';
import {Action} from '../../../../../@core/Action';
import {Document} from '../../../modal/document';
import {ModalUtils} from '../../../../../@core/utils';
import {LoanConfigFormComponent} from './loan-config-form/loan-config-form.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EligibilityLoanConfigServiceService} from "./eligibility-loan-config-service.service";

@Component({
  selector: 'app-eligibility-loan-config',
  templateUrl: './eligibility-loan-config.component.html',
  styleUrls: ['./eligibility-loan-config.component.scss']
})
export class EligibilityLoanConfigComponent implements OnInit {
  eligibilityLoanConfig=[];
  constructor(private router: Router,
              private modalService: NgbModal,
              private service: EligibilityLoanConfigServiceService
              ) { }

  ngOnInit() {
    this.loadData();
    console.log(this.eligibilityLoanConfig)
  }

  loadData(){
    this.service.getAllEligibilityLoanConfig().subscribe( resp => {
      console.log(resp);
      this.eligibilityLoanConfig=resp.detail;
    })
  }

  add() {
    const modalRef = this.modalService.open(LoanConfigFormComponent, {backdrop: 'static', size: 'lg'});
    modalRef.componentInstance.action = Action.ADD;
    // modalRef.componentInstance.model = new LoanConfigFormComponent();
    // this.router.navigate(['home/admin/eligibility/loan-config-form']);
  }




}
