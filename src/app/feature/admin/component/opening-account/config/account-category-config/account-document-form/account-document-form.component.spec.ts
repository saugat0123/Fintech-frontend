import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDocumentFormComponent } from './account-document-form.component';

describe('AccountDocumentFormComponent', () => {
  let component: AccountDocumentFormComponent;
  let fixture: ComponentFixture<AccountDocumentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountDocumentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDocumentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
