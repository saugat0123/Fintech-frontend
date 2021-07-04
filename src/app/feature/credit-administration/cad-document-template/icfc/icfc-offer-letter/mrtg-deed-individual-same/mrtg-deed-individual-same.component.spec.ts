import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MrtgDeedIndividualSameComponent } from './mrtg-deed-individual-same.component';

describe('MrtgDeedIndividualSameComponent', () => {
  let component: MrtgDeedIndividualSameComponent;
  let fixture: ComponentFixture<MrtgDeedIndividualSameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MrtgDeedIndividualSameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrtgDeedIndividualSameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
