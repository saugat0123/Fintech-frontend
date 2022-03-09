import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherChargesComponent } from './other-charges.component';

describe('OtherChargesComponent', () => {
  let component: OtherChargesComponent;
  let fixture: ComponentFixture<OtherChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
