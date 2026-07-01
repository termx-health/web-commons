import {AfterViewChecked, Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {NzButtonShape, NzButtonSize, NzButtonType} from 'ng-zorro-antd/button';
import {BooleanInput} from '@termx-health/core-util';

@Component({
  standalone: false,
  selector: 'm-button',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'm-button-wrapper',
    '[class.m-button-loading]': `mLoading`
  },
  template: `
    <button class="m-button"
        nz-button
        [style]="mStyle"
        [class]="mClass"
        [type]="type"
        [nzType]="mDisplay"
        [nzShape]="mShape"
        [nzSize]="mSize"
        [disabled]="disabled | toBoolean"
        [nzLoading]="mLoading | toBoolean"
        [attr.aria-label]="(mAriaLabel | i18n) || null"
        (click)="!disabled ? mClick.emit($event): null"
    >
      <ng-container *ngIf="mLabel">
        {{mLabel | i18n}}
      </ng-container>
      <ng-container *ngIf="!mLabel">
        <ng-content></ng-content>
      </ng-container>
    </button>
  `
})
export class MuiButtonComponent implements AfterViewChecked {
  public static ngAcceptInputType_mLoading: boolean | string;
  public static ngAcceptInputType_disabled: boolean | string;

  private ariaWired = false;

  public constructor(private el: ElementRef) {}

  // Accessibility: icon-only buttons (no text, no explicit label) are invisible to screen
  // readers (WCAG 4.1.2). Derive a fallback accessible name from the projected icon's code
  // so every icon button has a name; callers should still set mAriaLabel for a clearer one.
  public ngAfterViewChecked(): void {
    if (this.ariaWired || this.mLabel || this.mAriaLabel) {
      return;
    }
    const btn = (this.el.nativeElement as HTMLElement).querySelector('button');
    if (!btn) {
      return;
    }
    if ((btn.textContent || '').trim()) {
      this.ariaWired = true; // has visible text — no label needed
      return;
    }
    if (btn.getAttribute('aria-label')) {
      this.ariaWired = true;
      return;
    }
    const icon = btn.querySelector('[mcode], [class*="anticon-"], [nztype]');
    const code = icon && (icon.getAttribute('mcode') || icon.getAttribute('nztype') ||
      ((icon.className.toString().match(/anticon-([\w-]+)/) || [])[1]));
    if (code) {
      btn.setAttribute('aria-label', code.replace(/-/g, ' '));
      this.ariaWired = true;
    }
  }

  @Input() public type: string = 'button';
  @Input() public mLabel?: string;
  // Accessible name for icon-only buttons (rendered as aria-label); has no visual effect.
  @Input() public mAriaLabel?: string;
  @Input() public mDisplay: NzButtonType = 'default';
  @Input() public mShape: NzButtonShape = null;
  @Input() public mSize: NzButtonSize = 'default';
  @Input() @BooleanInput() public mLoading: boolean;
  @Input() @BooleanInput() public disabled: boolean;

  @Input() public mStyle?: string;
  @Input() public mClass?: string;
  @Output() public mClick = new EventEmitter<MouseEvent>();
}



