import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeKarjaComponent } from './bike-karja.component';

describe('BikeKarjaComponent', () => {
  let component: BikeKarjaComponent;
  let fixture: ComponentFixture<BikeKarjaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BikeKarjaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BikeKarjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
