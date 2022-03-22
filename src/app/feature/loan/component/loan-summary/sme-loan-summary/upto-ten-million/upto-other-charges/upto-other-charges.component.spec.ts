import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UptoOtherChargesComponent } from './upto-other-charges.component';

describe('UptoOtherChargesComponent', () => {
  let component: UptoOtherChargesComponent;
  let fixture: ComponentFixture<UptoOtherChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UptoOtherChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UptoOtherChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
