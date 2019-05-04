import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddValuatorComponent} from './add-valuator.component';

describe('AddValuatorComponent', () => {
  let component: AddValuatorComponent;
  let fixture: ComponentFixture<AddValuatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddValuatorComponent]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddValuatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
