import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MGroupSummaryComponent } from './m-group-summary.component';

describe('MGroupSummaryComponent', () => {
  let component: MGroupSummaryComponent;
  let fixture: ComponentFixture<MGroupSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MGroupSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MGroupSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
