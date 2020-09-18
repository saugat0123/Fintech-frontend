import {Component, OnInit} from '@angular/core';
import {Guarantor} from '../../../../model/guarantor';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'app-guarantor-detail',
  templateUrl: './guarantor-detail.component.html',
  styleUrls: ['./guarantor-detail.component.scss']
})
export class GuarantorDetailComponent implements OnInit {
   guarantorData: Guarantor;

  constructor(protected dialogRef: NbDialogRef<GuarantorDetailComponent>) { }

  ngOnInit() {
  }

  findAge(date: Date) {
    const timeDiff = Math.abs(Date.now() - new Date(date).getTime());
    return  Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
  }

  onClose() {
    this.dialogRef.close();
  }
}
