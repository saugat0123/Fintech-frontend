import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeKarjaPrintComponent } from './bike-karja-print.component';

describe('BikeKarjaPrintComponent', () => {
  let component: BikeKarjaPrintComponent;
  let fixture: ComponentFixture<BikeKarjaPrintComponent>;

  beforeEach(async(() => {
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
