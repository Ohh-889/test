'use client';
/* eslint-disable react-hooks/exhaustive-deps */

import { Slot } from '@radix-ui/react-slot';
import { capitalize, isEqual, } from 'radash';
import type { ReactElement } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import type { AllPathsKeys } from '../../../../../types';
import { getEventValue, isNil, omitUndefined, toArray } from '../../../../../utils';

import type { StoreValue } from '../../form-core/types';
import type { Rule } from '../../form-core/validation';
import type { EventArgs } from '../../types/shared-types';
import type { InternalFormInstance } from '../hooks/FieldContext';
import { useFieldContext } from '../hooks/FieldContext';

export type FieldProps<Values> = {
  children?: ReactElement;
  controlMode?: 'controlled' | 'uncontrolled';
  getValueFromEvent?: (...args: EventArgs) => StoreValue;
  getValueProps?: (value: StoreValue) => StoreValue;
  initialValue?: StoreValue;
  name: AllPathsKeys<Values>;
  normalize?: (value: StoreValue, prevValue: StoreValue, allValues: Values) => StoreValue;
  preserve?: boolean;
  rules?: Rule[];
  trigger?: string;
  unControlledValueChange?: (ref: any, newValue: StoreValue) => void;
  validateTrigger?: string | string[] | false;
  valuePropName?: string;
} & Record<string, any>;

function Field<Values = any>(props: FieldProps<Values>) {
  const {
    children,
    controlMode = 'uncontrolled',
    getValueFromEvent,
    initialValue,
    name,
    normalize,
    preserve = true,
    rules,
    trigger = 'onChange',
    unControlledValueChange,
    validateTrigger,
    valuePropName = 'value',
    ...rest
  } = props;

  const [_, forceUpdate] = useState({});

  const fieldContext = useFieldContext<Values>();

  const normalizedChangedRef = useRef(false);

  const key = useId();

  const cref = useRef<any>(null);

  const {
    getFieldsValue,
    getFieldValue,
    getInternalHooks,
    setFieldValue,
    validateField,
    validateTrigger: fieldValidateTrigger
  } = fieldContext as unknown as InternalFormInstance<Values>;

  const { registerField, setFieldRules } = getInternalHooks();

  const isControlled = controlMode === 'controlled';

  const mergedValidateTrigger = validateTrigger || fieldValidateTrigger;

  const validateTriggerList: string[] = toArray(mergedValidateTrigger);

  const make =
    (evt: string) =>
      (..._args: any[]) =>
        validateField(name, { trigger: evt });

  const restValidateTriggerList = validateTriggerList
    .filter(item => item !== trigger)
    .reduce(
      (acc, item) => {
        acc[item] = make(item);

        return acc;
      },
      {} as Record<string, (...args: any[]) => void>
    );

  const value = getFieldValue(name) || initialValue;

  const valueProps = isControlled ? { [valuePropName]: value } : { [`default${capitalize(valuePropName)}`]: value };

  const controlledProps = omitUndefined({
    [trigger]: name
      ? (...args: any[]) => {
        let newValue: StoreValue;

        const oldValue = getFieldValue(name);

        if (getValueFromEvent) {
          newValue = getValueFromEvent(...args);
        } else {
          newValue = getEventValue(valuePropName, ...args);
        }

        if (normalize) {
          const norm = normalize(newValue, oldValue, getFieldsValue() as Values);

          if (!isEqual(norm, newValue)) {
            newValue = norm;
            normalizedChangedRef.current = true;
          }
        }

        if (newValue !== oldValue) {
          setFieldValue(name, newValue);
        }

        if (validateTriggerList.includes(trigger)) {
          validateField(name, { trigger });
        }
      }
      : undefined
  });

  useEffect(() => {
    const unregister = registerField({
      changeValue: newValue => {
        if (isControlled) {
          forceUpdate({});
          return;
        }
        const el = cref.current;

        if (!el) return;

        if (unControlledValueChange) {
          unControlledValueChange(el, newValue);
        } else {
          el.value = isNil(newValue) ? '' : (newValue as any);
        }
      },
      initialValue,
      name,
      preserve
    });

    setFieldRules(name, rules);

    return () => {
      unregister();
    };
  }, []);

  return (
    <Slot
      key={key}
      {...(valueProps as any)}
      {...controlledProps}
      {...restValidateTriggerList}
      {...rest}
      ref={cref}
    >
      {children}
    </Slot>
  );
}

export default Field;
