import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalOverdraftComponent } from './personal-overdraft.component';

describe('PersonalOverdraftComponent', () => {
  let component: PersonalOverdraftComponent;
  let fixture: ComponentFixture<PersonalOverdraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalOverdraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalOverdraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
