import {Component, Input, OnInit} from '@angular/core';
import {Security} from '../../../../../model/security';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-security-document-view',
  templateUrl: './security-document-view.component.html',
  styleUrls: ['./security-document-view.component.scss']
})
export class SecurityDocumentViewComponent implements OnInit {
  @Input() security: Security;
  formData: any;
  securityDocument: any;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.security.data)) {
      this.formData = JSON.parse(this.security.data);
      if (!ObjectUtil.isEmpty(this.formData['initialForm']['securityDocument'])) {
        this.securityDocument = JSON.parse(this.formData['initialForm']['securityDocument']);
      }
    }
  }

}
