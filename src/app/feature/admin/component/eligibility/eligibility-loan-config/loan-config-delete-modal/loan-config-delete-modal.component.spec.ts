import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanConfigDeleteModalComponent } from './loan-config-delete-modal.component';

describe('LoanConfigDeleteModalComponent', () => {
  let component: LoanConfigDeleteModalComponent;
  let fixture: ComponentFixture<LoanConfigDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanConfigDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanConfigDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
