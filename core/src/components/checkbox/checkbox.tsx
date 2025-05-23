import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, h } from '@stencil/core';
import type { Attributes } from '@utils/helpers';
import { inheritAriaAttributes, renderHiddenInput } from '@utils/helpers';
import { createColorClasses, hostContext } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
import type { Color, Mode } from '../../interface';

import type { CheckboxChangeEventDetail } from './checkbox-interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot - The label text to associate with the checkbox. Use the "labelPlacement" property to control where the label is placed relative to the checkbox.
 *
 * @part container - The container for the checkbox mark.
 * @part label - The label text describing the checkbox.
 * @part mark - The checkmark used to indicate the checked state.
 * @part supporting-text - Supporting text displayed beneath the checkbox label.
 * @part helper-text - Supporting text displayed beneath the checkbox label when the checkbox is valid.
 * @part error-text - Supporting text displayed beneath the checkbox label when the checkbox is invalid and touched.
 */
@Component({
  tag: 'ion-checkbox',
  styleUrls: {
    ios: 'checkbox.ios.scss',
    md: 'checkbox.md.scss',
  },
  shadow: true,
})
export class Checkbox implements ComponentInterface {
  private inputId = `ion-cb-${checkboxIds++}`;
  private inputLabelId = `${this.inputId}-lbl`;
  private helperTextId = `${this.inputId}-helper-text`;
  private errorTextId = `${this.inputId}-error-text`;
  private focusEl?: HTMLElement;
  private inheritedAttributes: Attributes = {};

  @Element() el!: HTMLIonCheckboxElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

  /**
   * If `true`, the checkbox is selected.
   */
  @Prop({ mutable: true }) checked = false;

  /**
   * If `true`, the checkbox will visually appear as indeterminate.
   */
  @Prop({ mutable: true }) indeterminate = false;

  /**
   * If `true`, the user cannot interact with the checkbox.
   */
  @Prop() disabled = false;

  /**
   * Text that is placed under the checkbox label and displayed when an error is detected.
   */
  @Prop() errorText?: string;

  /**
   * Text that is placed under the checkbox label and displayed when no error is detected.
   */
  @Prop() helperText?: string;

  /**
   * The value of the checkbox does not mean if it's checked or not, use the `checked`
   * property for that.
   *
   * The value of a checkbox is analogous to the value of an `<input type="checkbox">`,
   * it's only used when the checkbox participates in a native `<form>`.
   */
  @Prop() value: any | null = 'on';

  /**
   * Where to place the label relative to the checkbox.
   * `"start"`: The label will appear to the left of the checkbox in LTR and to the right in RTL.
   * `"end"`: The label will appear to the right of the checkbox in LTR and to the left in RTL.
   * `"fixed"`: The label has the same behavior as `"start"` except it also has a fixed width. Long text will be truncated with ellipses ("...").
   * `"stacked"`: The label will appear above the checkbox regardless of the direction. The alignment of the label can be controlled with the `alignment` property.
   */
  @Prop() labelPlacement: 'start' | 'end' | 'fixed' | 'stacked' = 'start';

  /**
   * How to pack the label and checkbox within a line.
   * `"start"`: The label and checkbox will appear on the left in LTR and
   * on the right in RTL.
   * `"end"`: The label and checkbox will appear on the right in LTR and
   * on the left in RTL.
   * `"space-between"`: The label and checkbox will appear on opposite
   * ends of the line with space between the two elements.
   * Setting this property will change the checkbox `display` to `block`.
   */
  @Prop() justify?: 'start' | 'end' | 'space-between';

  /**
   * How to control the alignment of the checkbox and label on the cross axis.
   * `"start"`: The label and control will appear on the left of the cross axis in LTR, and on the right side in RTL.
   * `"center"`: The label and control will appear at the center of the cross axis in both LTR and RTL.
   * Setting this property will change the checkbox `display` to `block`.
   */
  @Prop() alignment?: 'start' | 'center';

  /**
   * If true, screen readers will announce it as a required field. This property
   * works only for accessibility purposes, it will not prevent the form from
   * submitting if the value is invalid.
   */
  @Prop() required = false;

  /**
   * Emitted when the checked property has changed as a result of a user action such as a click.
   *
   * This event will not emit when programmatically setting the `checked` property.
   */
  @Event() ionChange!: EventEmitter<CheckboxChangeEventDetail>;

  /**
   * Emitted when the checkbox has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the checkbox loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  componentWillLoad() {
    this.inheritedAttributes = {
      ...inheritAriaAttributes(this.el),
    };
  }

  /** @internal */
  @Method()
  async setFocus() {
    if (this.focusEl) {
      this.focusEl.focus();
    }
  }

  /**
   * Sets the checked property and emits
   * the ionChange event. Use this to update the
   * checked state in response to user-generated
   * actions such as a click.
   */
  private setChecked = (state: boolean) => {
    const isChecked = (this.checked = state);
    this.ionChange.emit({
      checked: isChecked,
      value: this.value,
    });
  };

  private toggleChecked = (ev: Event) => {
    ev.preventDefault();

    this.setFocus();
    this.setChecked(!this.checked);
    this.indeterminate = false;
  };

  private onFocus = () => {
    this.ionFocus.emit();
  };

  private onBlur = () => {
    this.ionBlur.emit();
  };

  private onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === ' ') {
      ev.preventDefault();
      if (!this.disabled) {
        this.toggleChecked(ev);
      }
    }
  };

  private onClick = (ev: MouseEvent) => {
    if (this.disabled) {
      return;
    }

    this.toggleChecked(ev);
  };

  /**
   * Stops propagation when the display label is clicked,
   * otherwise, two clicks will be triggered.
   */
  private onDivLabelClick = (ev: MouseEvent) => {
    ev.stopPropagation();
  };

  private getHintTextID(): string | undefined {
    const { el, helperText, errorText, helperTextId, errorTextId } = this;

    if (el.classList.contains('ion-touched') && el.classList.contains('ion-invalid') && errorText) {
      return errorTextId;
    }

    if (helperText) {
      return helperTextId;
    }

    return undefined;
  }

  /**
   * Responsible for rendering helper text and error text.
   * This element should only be rendered if hint text is set.
   */
  private renderHintText() {
    const { helperText, errorText, helperTextId, errorTextId } = this;

    /**
     * undefined and empty string values should
     * be treated as not having helper/error text.
     */
    const hasHintText = !!helperText || !!errorText;
    if (!hasHintText) {
      return;
    }

    return (
      <div class="checkbox-bottom">
        <div id={helperTextId} class="helper-text" part="supporting-text helper-text">
          {helperText}
        </div>
        <div id={errorTextId} class="error-text" part="supporting-text error-text">
          {errorText}
        </div>
      </div>
    );
  }

  render() {
    const {
      color,
      checked,
      disabled,
      el,
      getSVGPath,
      indeterminate,
      inheritedAttributes,
      inputId,
      justify,
      labelPlacement,
      name,
      value,
      alignment,
      required,
    } = this;
    const mode = getIonMode(this);
    const path = getSVGPath(mode, indeterminate);
    const hasLabelContent = el.textContent !== '';

    renderHiddenInput(true, el, name, checked ? value : '', disabled);

    // The host element must have a checkbox role to ensure proper VoiceOver
    // support in Safari for accessibility.
    return (
      <Host
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : `${checked}`}
        aria-describedby={this.getHintTextID()}
        aria-invalid={this.getHintTextID() === this.errorTextId}
        aria-labelledby={hasLabelContent ? this.inputLabelId : null}
        aria-label={inheritedAttributes['aria-label'] || null}
        aria-disabled={disabled ? 'true' : null}
        tabindex={disabled ? undefined : 0}
        onKeyDown={this.onKeyDown}
        class={createColorClasses(color, {
          [mode]: true,
          'in-item': hostContext('ion-item', el),
          'checkbox-checked': checked,
          'checkbox-disabled': disabled,
          'checkbox-indeterminate': indeterminate,
          interactive: true,
          [`checkbox-justify-${justify}`]: justify !== undefined,
          [`checkbox-alignment-${alignment}`]: alignment !== undefined,
          [`checkbox-label-placement-${labelPlacement}`]: true,
        })}
        onClick={this.onClick}
      >
        <label class="checkbox-wrapper" htmlFor={inputId}>
          {/*
            The native control must be rendered
            before the visible label text due to https://bugs.webkit.org/show_bug.cgi?id=251951
          */}
          <input
            type="checkbox"
            checked={checked ? true : undefined}
            disabled={disabled}
            id={inputId}
            onChange={this.toggleChecked}
            onFocus={() => this.onFocus()}
            onBlur={() => this.onBlur()}
            ref={(focusEl) => (this.focusEl = focusEl)}
            required={required}
            {...inheritedAttributes}
          />
          <div
            class={{
              'label-text-wrapper': true,
              'label-text-wrapper-hidden': !hasLabelContent,
            }}
            part="label"
            id={this.inputLabelId}
            onClick={this.onDivLabelClick}
          >
            <slot></slot>
            {this.renderHintText()}
          </div>
          <div class="native-wrapper">
            <svg class="checkbox-icon" viewBox="0 0 24 24" part="container">
              {path}
            </svg>
          </div>
        </label>
      </Host>
    );
  }

  private getSVGPath(mode: Mode, indeterminate: boolean): HTMLElement {
    let path = indeterminate ? (
      <path d="M6 12L18 12" part="mark" />
    ) : (
      <path d="M5.9,12.5l3.8,3.8l8.8-8.8" part="mark" />
    );

    if (mode === 'md') {
      path = indeterminate ? (
        <path d="M2 12H22" part="mark" />
      ) : (
        <path d="M1.73,12.91 8.1,19.28 22.79,4.59" part="mark" />
      );
    }

    return path;
  }
}

let checkboxIds = 0;
