import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MrtgDeedIndividualDifferentComponent } from './mrtg-deed-individual-different.component';

describe('MrtgDeedIndividualDifferentComponent', () => {
  let component: MrtgDeedIndividualDifferentComponent;
  let fixture: ComponentFixture<MrtgDeedIndividualDifferentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MrtgDeedIndividualDifferentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrtgDeedIndividualDifferentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
