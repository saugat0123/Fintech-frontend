import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLandAndBuildingLoanEditComponent } from './home-land-and-building-loan-edit.component';

describe('HomeLandAndBuildingLoanEditComponent', () => {
  let component: HomeLandAndBuildingLoanEditComponent;
  let fixture: ComponentFixture<HomeLandAndBuildingLoanEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeLandAndBuildingLoanEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLandAndBuildingLoanEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
