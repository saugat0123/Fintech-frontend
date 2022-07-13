import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroSynopsisComponent } from './micro-synopsis.component';

describe('MicroSynopsisComponent', () => {
  let component: MicroSynopsisComponent;
  let fixture: ComponentFixture<MicroSynopsisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroSynopsisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroSynopsisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
