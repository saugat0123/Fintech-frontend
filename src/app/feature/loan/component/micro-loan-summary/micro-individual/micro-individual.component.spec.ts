import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MicroIndividualComponent } from './micro-individual.component';

describe('MicroIndividualComponent', () => {
  let component: MicroIndividualComponent;
  let fixture: ComponentFixture<MicroIndividualComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
