import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FeesCommissionsViewComponent } from './fees-commissions-view.component';

describe('FeesCommissionsViewComponent', () => {
  let component: FeesCommissionsViewComponent;
  let fixture: ComponentFixture<FeesCommissionsViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FeesCommissionsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeesCommissionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
