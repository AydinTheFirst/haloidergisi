import * as React from "react";
import { FieldPath, FieldValues, useFormContext, Controller } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type FieldRootProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
  children?: React.ReactNode;
  className?: string;
};

function FieldRoot<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, children, className }: FieldRootProps<TFieldValues, TName>) {
  const form = useFormContext<TFieldValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { ...field } as any);
            }
            return child;
          })}
        </FormItem>
      )}
    />
  );
}

interface FieldLabelProps extends React.ComponentProps<typeof FormLabel> {}

function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <FormLabel
      className={className}
      {...props}
    />
  );
}

interface FieldInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  field?: any;
}

function FieldInput({ className, ...props }: FieldInputProps) {
  return (
    <FormControl>
      <Input
        className={className}
        {...props}
      />
    </FormControl>
  );
}

interface FieldHelperTextProps extends React.ComponentProps<typeof FormDescription> {}

function FieldHelperText({ className, ...props }: FieldHelperTextProps) {
  return (
    <FormDescription
      className={className}
      {...props}
    />
  );
}

interface FieldErrorMessageProps extends React.ComponentProps<typeof FormMessage> {}

function FieldErrorMessage({ className, ...props }: FieldErrorMessageProps) {
  return (
    <FormMessage
      className={className}
      {...props}
    />
  );
}

interface FieldTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  field?: any;
}

function FieldTextArea({ className, ...props }: FieldTextAreaProps) {
  return (
    <FormControl>
      <Textarea
        className={className}
        {...props}
      />
    </FormControl>
  );
}

interface FieldSelectProps extends React.ComponentProps<typeof Select> {
  field?: any;
  children?: React.ReactNode;
}

function FieldSelect({ children, ...props }: FieldSelectProps) {
  return (
    <FormControl>
      <Select {...props}>{children}</Select>
    </FormControl>
  );
}

const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Input: FieldInput,
  HelperText: FieldHelperText,
  ErrorMessage: FieldErrorMessage,
  TextArea: FieldTextArea,
  Select: FieldSelect,
};

export {
  Field,
  FieldRoot,
  FieldLabel,
  FieldInput,
  FieldHelperText,
  FieldErrorMessage,
  FieldTextArea,
  FieldSelect,
};
