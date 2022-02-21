import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLoanChecklistComponent } from './home-loan-checklist.component';

describe('HomeLoanChecklistComponent', () => {
  let component: HomeLoanChecklistComponent;
  let fixture: ComponentFixture<HomeLoanChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeLoanChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLoanChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
