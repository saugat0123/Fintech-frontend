import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditPartnerInfoComponent } from './edit-partner-info.component';

describe('EditPartnerInfoComponent', () => {
  let component: EditPartnerInfoComponent;
  let fixture: ComponentFixture<EditPartnerInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPartnerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPartnerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
