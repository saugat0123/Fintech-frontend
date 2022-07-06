import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingExposureComponent } from './existing-exposure.component';

describe('ExistingExposureComponent', () => {
  let component: ExistingExposureComponent;
  let fixture: ComponentFixture<ExistingExposureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingExposureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingExposureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
