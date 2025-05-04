/* eslint-disable react/prop-types */
import { TextInput } from '@mantine/core';
import { convertIsoToLocal, convertLocalToIso } from './DateTimeInput.utils';

/**
 * The DateTimeInput component is a wrapper around the HTML5 input type="datetime-local".
 * The main purpose is to reconcile time zones.
 * Most of our date/time values are in ISO-8601, which includes a time zone offset.
 * The datetime-local input does not support the time zone offset.
 * @param props - The Input props.
 * @returns The JSX element to render.
 */

export function DateTimeInput(props) {
  return (
    <TextInput
      id={props.name}
      name={props.name}
      label={props.label}
      data-autofocus={props.autoFocus}
      data-testid={props['data-testid'] ?? props.name}
      placeholder={props.placeholder}
      required={props.required}
      disabled={props.disabled}
      type={getInputType()}
      autoFocus={props.autoFocus}
      styles={{
        input: { borderColor: '#2980b9' },
        label: { fontSize: 18 },
      }}
      // error={getErrorsForInput(props.outcome, props.name)}
      {...props}
      onChange={(e) => {
        if (props.onChange) {
          const newValue = e.currentTarget.value;
          props.onChange(convertLocalToIso(newValue));
        }
      }}
      defaultValue={convertIsoToLocal(props.defaultValue)}
    />
  );
}

/**
 * Returns the input type for the requested type.
 * JSDOM does not support many of the valid <input> type attributes.
 * For example, it won't fire change events for <input type="datetime-local">.
 * @returns The input type for the current environment.
 */
function getInputType() {
  return import.meta.env.NODE_ENV === 'test' ? 'text' : 'datetime-local';
}
