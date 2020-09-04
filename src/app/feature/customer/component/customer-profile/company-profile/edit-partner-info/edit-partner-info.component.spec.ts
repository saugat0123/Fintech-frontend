import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPartnerInfoComponent } from './edit-partner-info.component';

describe('EditPartnerInfoComponent', () => {
  let component: EditPartnerInfoComponent;
  let fixture: ComponentFixture<EditPartnerInfoComponent>;

  beforeEach(async(() => {
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
