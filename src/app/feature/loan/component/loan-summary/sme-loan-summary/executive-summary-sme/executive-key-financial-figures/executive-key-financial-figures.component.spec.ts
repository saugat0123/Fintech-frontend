import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveKeyFinancialFiguresComponent } from './executive-key-financial-figures.component';

describe('ExecutiveKeyFinancialFiguresComponent', () => {
  let component: ExecutiveKeyFinancialFiguresComponent;
  let fixture: ComponentFixture<ExecutiveKeyFinancialFiguresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutiveKeyFinancialFiguresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveKeyFinancialFiguresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
