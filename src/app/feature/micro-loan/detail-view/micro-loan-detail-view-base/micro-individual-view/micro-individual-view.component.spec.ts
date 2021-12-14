import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MicroIndividualViewComponent } from './micro-individual-view.component';

describe('MicroIndividualViewComponent', () => {
  let component: MicroIndividualViewComponent;
  let fixture: ComponentFixture<MicroIndividualViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroIndividualViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroIndividualViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
