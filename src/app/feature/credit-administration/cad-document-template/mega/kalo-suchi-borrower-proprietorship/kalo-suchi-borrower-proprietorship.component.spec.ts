import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaloSuchiBorrowerProprietorshipComponent } from './kalo-suchi-borrower-proprietorship.component';

describe('KaloSuchiBorrowerProprietorshipComponent', () => {
  let component: KaloSuchiBorrowerProprietorshipComponent;
  let fixture: ComponentFixture<KaloSuchiBorrowerProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaloSuchiBorrowerProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaloSuchiBorrowerProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
