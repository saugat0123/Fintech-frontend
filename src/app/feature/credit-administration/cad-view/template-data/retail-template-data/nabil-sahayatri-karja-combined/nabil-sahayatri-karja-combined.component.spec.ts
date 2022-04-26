import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NabilSahayatriKarjaCombinedComponent } from './nabil-sahayatri-karja-combined.component';

describe('NabilSahayatriKarjaCombinedComponent', () => {
  let component: NabilSahayatriKarjaCombinedComponent;
  let fixture: ComponentFixture<NabilSahayatriKarjaCombinedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NabilSahayatriKarjaCombinedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NabilSahayatriKarjaCombinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
