import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NegativeLienIndividualComponent } from './negative-lien-individual.component';

describe('NegativeLienIndividualComponent', () => {
  let component: NegativeLienIndividualComponent;
  let fixture: ComponentFixture<NegativeLienIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NegativeLienIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NegativeLienIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
