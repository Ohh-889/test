'use client';
/* eslint-disable react-hooks/exhaustive-deps */

import { Slot } from '@radix-ui/react-slot';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import type { AllPathsKeys } from '../../../../../types';

import type { StoreValue } from '../../form-core/types';
import type { Rule } from '../../form-core/validation';
import type { InternalFormInstance } from '../hooks/FieldContext';
import { useFieldContext } from '../hooks/FieldContext';

export type ComputedFieldProps<Values, T extends AllPathsKeys<Values> = AllPathsKeys<Values>> = {
  children?: ReactElement;
  compute: (get: (n: T) => StoreValue, all: Values) => StoreValue;
  deps: T[];
  name: T;
  preserve?: boolean;
  rules?: Rule[];
  valuePropName?: string;
};

function ComputedField<Values = any>({
  children,
  compute,
  deps,
  name,
  preserve = true,
  rules,
  valuePropName = 'value'
}: ComputedFieldProps<Values>) {
  const fieldContext = useFieldContext<Values>();

  const { getFieldValue, getInternalHooks } = fieldContext as unknown as InternalFormInstance<Values>;

  const [value, updateValue] = useState(getFieldValue(name));

  const { registerComputed, registerField, setFieldRules } = getInternalHooks();

  useEffect(() => {
    const unregister = registerComputed(name, deps, compute);

    // Subscribe to current field changes → force refresh
    const unsub = registerField({
      changeValue: newValue => {
        updateValue(newValue);
      },
      initialValue: getFieldValue(name),
      name,
      preserve
    });

    if (rules) setFieldRules(name, rules);

    return () => {
      unregister();
      unsub();
    };
  }, []);

  const slotProps = {
    readOnly: true,
    [valuePropName]: value ?? ''
  };

  return <Slot {...slotProps}>{children}</Slot>;
}

export default ComputedField;
