import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaloSuchiBorrowerIndividualComponent } from './kalo-suchi-borrower-individual.component';

describe('KaloSuchiBorrowerIndividualComponent', () => {
  let component: KaloSuchiBorrowerIndividualComponent;
  let fixture: ComponentFixture<KaloSuchiBorrowerIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaloSuchiBorrowerIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaloSuchiBorrowerIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
