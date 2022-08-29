import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaloSuchiBorrowerPgIndividualComponent } from './kalo-suchi-borrower-pg-individual.component';

describe('KaloSuchiBorrowerPgIndividualComponent', () => {
  let component: KaloSuchiBorrowerPgIndividualComponent;
  let fixture: ComponentFixture<KaloSuchiBorrowerPgIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaloSuchiBorrowerPgIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaloSuchiBorrowerPgIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
