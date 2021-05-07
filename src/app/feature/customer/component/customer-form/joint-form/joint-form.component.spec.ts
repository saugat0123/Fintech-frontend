import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JointFormComponent } from './joint-form.component';

describe('JointFormComponent', () => {
  let component: JointFormComponent;
  let fixture: ComponentFixture<JointFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JointFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JointFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
