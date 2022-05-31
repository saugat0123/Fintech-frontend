import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section5InterstPenalChargeComponent } from './section5-interst-penal-charge.component';

describe('Section5InterstPenalChargeComponent', () => {
  let component: Section5InterstPenalChargeComponent;
  let fixture: ComponentFixture<Section5InterstPenalChargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section5InterstPenalChargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section5InterstPenalChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
