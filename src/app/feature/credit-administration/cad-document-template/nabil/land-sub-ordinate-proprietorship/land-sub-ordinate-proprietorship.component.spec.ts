import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandSubOrdinateProprietorshipComponent } from './land-sub-ordinate-proprietorship.component';

describe('LandSubOrdinateProprietorshipComponent', () => {
  let component: LandSubOrdinateProprietorshipComponent;
  let fixture: ComponentFixture<LandSubOrdinateProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandSubOrdinateProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandSubOrdinateProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
