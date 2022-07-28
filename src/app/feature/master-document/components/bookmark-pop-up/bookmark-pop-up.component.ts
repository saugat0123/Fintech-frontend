import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'app-bookmark-pop-up',
  templateUrl: './bookmark-pop-up.component.html',
  styleUrls: ['./bookmark-pop-up.component.scss']
})
export class BookmarkPopUpComponent implements OnInit {
  @Input() bookmarks: Array<string> = new Array<string>();

  constructor(private formBuilder: FormBuilder,
              private nbDialogRef: NbDialogRef<BookmarkPopUpComponent>) { }

  ngOnInit() {
  }

  public onProceed() {
    this.nbDialogRef.close('YES');
  }

  public onClose() {
    this.nbDialogRef.close('NO');
  }

}
