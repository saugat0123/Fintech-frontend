import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanActionModalComponent } from './loan-action-modal.component';

describe('LoanActionModalComponent', () => {
  let component: LoanActionModalComponent;
  let fixture: ComponentFixture<LoanActionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanActionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
