import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmsSummaryComponent } from './dms-summary.component';

describe('DmsSummaryComponent', () => {
  let component: DmsSummaryComponent;
  let fixture: ComponentFixture<DmsSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmsSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
