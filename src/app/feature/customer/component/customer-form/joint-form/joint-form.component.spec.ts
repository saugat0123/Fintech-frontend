import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JointFormComponent } from './joint-form.component';

describe('JointFormComponent', () => {
  let component: JointFormComponent;
  let fixture: ComponentFixture<JointFormComponent>;

  beforeEach(waitForAsync(() => {
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
