import React, { type FormEvent, type ReactNode } from 'react';
import { FormProvider as Form, type FieldValues, type UseFormReturn } from 'react-hook-form';

interface FormProviderProps<T extends FieldValues> {
  children: ReactNode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  methods: UseFormReturn<T>;
}

type ReadonlyFormProviderProps<T extends FieldValues> = Readonly<FormProviderProps<T>>;

export default function FormProvider<T extends FieldValues>({
  children,
  onSubmit,
  methods,
}: ReadonlyFormProviderProps<T>): React.JSX.Element {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit} style={{ width: '100%' }} autoComplete="off">
        {children}
      </form>
    </Form>
  );
}
