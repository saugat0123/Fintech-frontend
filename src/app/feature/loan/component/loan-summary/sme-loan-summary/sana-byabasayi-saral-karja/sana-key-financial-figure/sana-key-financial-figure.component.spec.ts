import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SanaKeyFinancialFigureComponent } from './sana-key-financial-figure.component';

describe('SanaKeyFinancialFigureComponent', () => {
  let component: SanaKeyFinancialFigureComponent;
  let fixture: ComponentFixture<SanaKeyFinancialFigureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SanaKeyFinancialFigureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanaKeyFinancialFigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
