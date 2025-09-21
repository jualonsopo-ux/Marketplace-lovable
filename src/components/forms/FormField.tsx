import React from 'react';
import { Controller, FieldPath, FieldValues, Control } from 'react-hook-form';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

/**
 * Enhanced form field components with built-in validation and styling
 */

interface BaseFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Text input field
interface TextFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type?: 'text' | 'email' | 'tel' | 'url' | 'password';
  maxLength?: number;
  pattern?: string;
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  required = false,
  disabled = false,
  className,
  type = 'text',
  maxLength,
  pattern,
}: TextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className={required ? "after:content-['*'] after:text-destructive after:ml-1" : ""}>
              {label}
            </FormLabel>
          )}
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              pattern={pattern}
              className={cn(
                fieldState.error && "border-destructive focus-visible:ring-destructive"
              )}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Textarea field
interface TextareaFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  rows?: number;
  maxLength?: number;
  resize?: boolean;
}

export function TextareaField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  required = false,
  disabled = false,
  className,
  rows = 4,
  maxLength,
  resize = false,
}: TextareaFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className={required ? "after:content-['*'] after:text-destructive after:ml-1" : ""}>
              {label}
            </FormLabel>
          )}
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              maxLength={maxLength}
              className={cn(
                !resize && "resize-none",
                fieldState.error && "border-destructive focus-visible:ring-destructive"
              )}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {maxLength && field.value && (
            <div className="text-xs text-muted-foreground text-right">
              {field.value.length}/{maxLength}
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Select field
interface SelectFieldOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  options: SelectFieldOption[];
  defaultValue?: string;
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  required = false,
  disabled = false,
  className,
  options,
  defaultValue,
}: SelectFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className={required ? "after:content-['*'] after:text-destructive after:ml-1" : ""}>
              {label}
            </FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            defaultValue={defaultValue || field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className={cn(
                fieldState.error && "border-destructive focus-visible:ring-destructive"
              )}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Checkbox field
interface CheckboxFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  checkboxLabel?: string;
}

export function CheckboxField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
  checkboxLabel,
}: CheckboxFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn("flex flex-row items-start space-x-3 space-y-0", className)}>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              className={cn(
                fieldState.error && "border-destructive"
              )}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            {(label || checkboxLabel) && (
              <FormLabel className={cn(
                "font-normal cursor-pointer",
                required && "after:content-['*'] after:text-destructive after:ml-1"
              )}>
                {checkboxLabel || label}
              </FormLabel>
            )}
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

// Switch field
interface SwitchFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  switchLabel?: string;
}

export function SwitchField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled = false,
  className,
  switchLabel,
}: SwitchFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-row items-center justify-between", className)}>
          <div className="space-y-0.5">
            {(label || switchLabel) && (
              <FormLabel className="font-normal">
                {switchLabel || label}
              </FormLabel>
            )}
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

// Number input field
interface NumberFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  min?: number;
  max?: number;
  step?: number;
}

export function NumberField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  required = false,
  disabled = false,
  className,
  min,
  max,
  step,
}: NumberFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, ...field }, fieldState }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className={required ? "after:content-['*'] after:text-destructive after:ml-1" : ""}>
              {label}
            </FormLabel>
          )}
          <FormControl>
            <Input
              {...field}
              type="number"
              placeholder={placeholder}
              disabled={disabled}
              min={min}
              max={max}
              step={step}
              onChange={(e) => {
                const value = e.target.value === '' ? undefined : Number(e.target.value);
                onChange(value);
              }}
              className={cn(
                fieldState.error && "border-destructive focus-visible:ring-destructive"
              )}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}