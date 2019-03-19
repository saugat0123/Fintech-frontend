import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanConfigComponent } from './loan-config.component.ts';

describe('LoanConfigComponent', () => {
  let component: LoanConfigComponent;
  let fixture: ComponentFixture<LoanConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
