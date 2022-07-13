import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroIndividualFormComponent } from './micro-individual-form.component';

describe('MicroIndividualFormComponent', () => {
  let component: MicroIndividualFormComponent;
  let fixture: ComponentFixture<MicroIndividualFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroIndividualFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroIndividualFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
