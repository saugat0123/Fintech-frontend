import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLoanDetailComponent } from './edit-loan-detail.component';

describe('EditLoanDetailComponent', () => {
  let component: EditLoanDetailComponent;
  let fixture: ComponentFixture<EditLoanDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLoanDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLoanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
