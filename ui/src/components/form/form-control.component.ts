import {AfterContentChecked, Component, ElementRef, Input, OnInit, Optional, ViewEncapsulation} from '@angular/core';
import {AbstractControl, ControlContainer, UntypedFormGroup, ValidationErrors} from '@angular/forms';
import {NzFormStatusService} from 'ng-zorro-antd/core/form';


@Component({
  standalone: false,
  selector: 'm-form-control, [m-form-control]',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
    <div class="m-form-control-error-explain" *ngIf="errors && mShowExplain">
      <span *ngFor="let code of errors | keys">
        {{P + code | i18n: errors}}
      </span>
    </div>
  `,
  host: {
    class: 'm-form-control',
    '[class.m-form-control--has-error]': `errors`,
  },
  providers: [NzFormStatusService]
})
export class MuiFormControlComponent implements OnInit, AfterContentChecked {
  @Input() public mName: string = '';
  @Input() public mShowExplain: boolean = true;

  public readonly P = 'marina.ui.form.validationError.';
  public controls: {[p: string]: AbstractControl} | undefined | null;

  private static labelSeq = 0;
  private labelWired = false;

  public constructor(
    private el: ElementRef,
    @Optional() private cc: ControlContainer,
    @Optional() public nzFormStatusService?: NzFormStatusService,
  ) {}

  public ngOnInit(): void {
    this.controls = this.cc?.control && (this.cc.control as UntypedFormGroup).controls;
  }

  // Accessibility: the projected control is not the element that carries the
  // field's <label for="…">, so screen readers see an unlabelled input (WCAG 1.3.1 /
  // 4.1.2). Wire the projected control(s) to the form-item's label via aria-labelledby.
  // aria-labelledby (rather than id/for) lets multi-value controls — e.g. the
  // multi-language input's per-language textareas — all reference one label without
  // duplicate ids. Runs once, after the projected content exists.
  private wireLabel(): void {
    if (this.labelWired) {
      return;
    }
    const host = this.el.nativeElement as HTMLElement;
    const controls = host.querySelectorAll<HTMLElement>('input, textarea, select, [role="combobox"], [role="textbox"]');
    if (!controls.length) {
      return; // projected control not rendered yet — try again next check
    }
    const item = host.closest('nz-form-item');
    const label = item?.querySelector<HTMLElement>('label') || null;
    if (label) {
      if (!label.id) {
        label.id = 'm-form-label-' + (MuiFormControlComponent.labelSeq++);
      }
      controls.forEach(c => {
        const hasName = c.getAttribute('aria-label') || c.getAttribute('aria-labelledby') ||
          (c.id && item?.querySelector('label[for="' + (window.CSS ? CSS.escape(c.id) : c.id) + '"]'));
        if (!hasName) {
          c.setAttribute('aria-labelledby', label.id);
        }
      });
    }
    this.labelWired = true;
  }

  public ngAfterContentChecked(): void {
    this.wireLabel();

    // fixme(remove zorro): Remove zorro or drop dependencies on zorro's inputs!
    //  Starting from zorro 13.3.0 update, they have changed the behaviour of 'ant-form-item-has-error' class, that was previously used to outline input red on error. Now it is done programmatically.
    //  This hack/fix/implementation relies on providing NzFormStatusService that every zorro input uses internally to correctly style the input.

    if (this.nzFormStatusService && this.controls?.[this.mName]) {
      const {dirty, errors} = this.controls[this.mName] || {};
      const status = dirty && errors ? 'error' : undefined;

      this.nzFormStatusService.formStatusChanges.next({
        status: status,
        hasFeedback: false
      });
    }
  }


  public get errors(): ValidationErrors | null {
    return this.controls?.[this.mName]?.dirty && this.controls?.[this.mName]?.errors;
  }
}
