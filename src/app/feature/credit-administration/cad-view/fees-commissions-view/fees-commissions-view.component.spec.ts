import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesCommissionsViewComponent } from './fees-commissions-view.component';

describe('FeesCommissionsViewComponent', () => {
  let component: FeesCommissionsViewComponent;
  let fixture: ComponentFixture<FeesCommissionsViewComponent>;

  beforeEach(async(() => {
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
