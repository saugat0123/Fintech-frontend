import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SanaOtherChargesComponent } from './sana-other-charges.component';

describe('SanaOtherChargesComponent', () => {
  let component: SanaOtherChargesComponent;
  let fixture: ComponentFixture<SanaOtherChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SanaOtherChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanaOtherChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
