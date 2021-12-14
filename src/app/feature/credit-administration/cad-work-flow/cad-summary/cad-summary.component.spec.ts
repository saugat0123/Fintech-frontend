import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CadSummaryComponent } from './cad-summary.component';

describe('CadSummaryComponent', () => {
  let component: CadSummaryComponent;
  let fixture: ComponentFixture<CadSummaryComponent>;

  beforeEach(waitForAsync(() => {
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
