import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquityMortgagedOverdraftComponent } from './equity-mortgaged-overdraft.component';

describe('EquityMortgagedOverdraftComponent', () => {
  let component: EquityMortgagedOverdraftComponent;
  let fixture: ComponentFixture<EquityMortgagedOverdraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquityMortgagedOverdraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquityMortgagedOverdraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
