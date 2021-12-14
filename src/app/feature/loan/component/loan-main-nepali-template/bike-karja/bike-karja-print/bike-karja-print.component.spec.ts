import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BikeKarjaPrintComponent } from './bike-karja-print.component';

describe('BikeKarjaPrintComponent', () => {
  let component: BikeKarjaPrintComponent;
  let fixture: ComponentFixture<BikeKarjaPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BikeKarjaPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BikeKarjaPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
