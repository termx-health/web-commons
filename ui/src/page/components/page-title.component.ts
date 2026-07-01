import {Component, Input} from '@angular/core';

@Component({
  standalone: false,
  selector: 'm-title',
  template:`
    <div class="m-justify-between">
      <div class="m-items-middle" role="heading" [attr.aria-level]="mLevel">
        <ng-container *ngIf="mTitle">
          {{mTitle  | i18n}}
        </ng-container>
        <ng-container *ngIf="!mTitle">
          <ng-content></ng-content>
        </ng-container>
      </div>
      <ng-content select="[mControls]"></ng-content>
    </div>
  `,
  host: {
    class: 'm-page-title'
  }
})
export class MuiPageTitleComponent {
  @Input() public mTitle: string;
  // Exposes the page title to assistive tech as a heading (default level 1) without
  // changing its visual styling (WCAG 1.3.1). Override for nested/section titles.
  @Input() public mLevel: number = 1;
}
