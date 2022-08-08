import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemitLoanSelfDeclarationComponent } from './remit-loan-self-declaration.component';

describe('RemitLoanSelfDeclarationComponent', () => {
  let component: RemitLoanSelfDeclarationComponent;
  let fixture: ComponentFixture<RemitLoanSelfDeclarationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemitLoanSelfDeclarationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemitLoanSelfDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
