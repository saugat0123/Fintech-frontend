import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {ReadmoreModelComponent} from '../../readmore-model/readmore-model.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-authority-section',
  templateUrl: './authority-section.component.html',
  styleUrls: ['./authority-section.component.scss']
})
export class AuthoritySectionComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  currentIndex: number;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.currentIndex = this.loanDataHolder.previousList.length;
  }

  customSafePipe(val) {
    if (!ObjectUtil.isEmpty(val)) {
      return val.replace(/(<([^>]+)>)/gi, ' ');
    }
  }

  open(comments) {
    const modalRef = this.modalService.open(ReadmoreModelComponent, {size: 'lg', backdrop: true});
    modalRef.componentInstance.comments = comments;
  }

}
