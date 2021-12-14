import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountDocumentFormComponent } from './account-document-form.component';

describe('AccountDocumentFormComponent', () => {
  let component: AccountDocumentFormComponent;
  let fixture: ComponentFixture<AccountDocumentFormComponent>;

  beforeEach(waitForAsync(() => {
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
