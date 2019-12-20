import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialDetailsComponent } from './financial-details.component';

describe('FinancialDetailsComponent', () => {
  let component: FinancialDetailsComponent;
  let fixture: ComponentFixture<FinancialDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
