import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLoanPrintComponent } from './home-loan-print.component';

describe('HomeLoanPrintComponent', () => {
  let component: HomeLoanPrintComponent;
  let fixture: ComponentFixture<HomeLoanPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeLoanPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLoanPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
