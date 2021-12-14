import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BusinessBackgroundComponent } from './business-background.component';

describe('BusinessBackgroundComponent', () => {
  let component: BusinessBackgroundComponent;
  let fixture: ComponentFixture<BusinessBackgroundComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessBackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
