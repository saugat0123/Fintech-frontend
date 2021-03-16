import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MGroupSummaryComponent } from './m-group-summary.component';

describe('MGroupSummaryComponent', () => {
  let component: MGroupSummaryComponent;
  let fixture: ComponentFixture<MGroupSummaryComponent>;

  beforeEach(async(() => {
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
