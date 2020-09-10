import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskGroupComponent } from './risk-group.component';

describe('RiskGroupComponent', () => {
  let component: RiskGroupComponent;
  let fixture: ComponentFixture<RiskGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
