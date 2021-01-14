import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadSummaryComponent } from './cad-summary.component';

describe('CadSummaryComponent', () => {
  let component: CadSummaryComponent;
  let fixture: ComponentFixture<CadSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
