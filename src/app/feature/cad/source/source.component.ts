import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {Source} from '../model/source';
import {CreditAdministrationService} from '../../credit-administration/service/credit-administration.service';
import {CadParamMasterEnum} from '../enum/cadParamMasterEnum';

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent implements OnInit {

  bookmarks !: FormArray
  cadForm: FormGroup
  bookMarkForm: FormGroup
  file: File;
  sourceId: number
  activeLoan: any
  loanList: any
  loanAssociation: any
  listOfBookMark = [];
  source: Source = new Source();
  @Input() formValue: Source
  sources: Array<Source> = new Array<Source>();
  cadEnum = CadParamMasterEnum


  constructor(private loanConfigService: LoanConfigService,
              private formBuilder: FormBuilder,
              private creditAdministrationService: CreditAdministrationService) {
  }

  ngOnInit() {
    this.formMaker();
    this.bookMarkFormMaker();
    this.getAllLoans();
    this.getLoanAssociation();
  }

  formMaker() {
    this.cadForm = this.formBuilder.group({
      customerAssociation: [undefined, Validators.required],
      loanAssociation: [undefined, Validators.required],
      loanList: [undefined, Validators.required],

    });

  }
  bookMarkFormMaker() {
    this.bookMarkForm = this.formBuilder.group({

    })
  }


  getAllLoans() {
    this.loanConfigService.getAll().subscribe(response => {
      this.loanList = response.detail;
      this.activeLoan = this.loanList.filter((d) => d.status === 'ACTIVE')
    }, error => {
      console.log(error);
    })
  }

  getLoanAssociation() {
    this.loanAssociation = this.cadForm.get('loanAssociation').value;
  }

  getBookMark(event: any) {
    const file = event.target.files[0];
    const formData: FormData = new FormData();
    formData.append('file', file)
    this.creditAdministrationService.getBookMark(formData).subscribe({
      next: (response: any) => {
        let data: any = JSON.parse(response.detail.params);
        this.listOfBookMark = data.label;
        console.log(this.listOfBookMark, 'list of bookmark');
        this.listOfBookMark.forEach((v, i) => {
          const control = new FormControl(0);
          this.bookMarkForm.addControl(v + i, control);
        });
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
      },
    });
  }


  onSubmit() {
    const formData: FormData = new FormData();
    formData.append('loanAssociation', this.cadForm.get('loanAssociation').value)
    formData.append('customerAssociation', this.cadForm.get('customerAssociation').value);
    const bookMarkValues = JSON.stringify(this.bookMarkForm.value);
    formData.append('bookmarkValues', bookMarkValues)

    this.creditAdministrationService.saveCadForm(formData).subscribe(response => {
      console.log(response);
    },error => {
      console.log(error);
    })

  }




}
