import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { TailwindStyles } from '../types/design';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stylesToClassString(styles: TailwindStyles): string {
  const classes: string[] = [];
  
  if (styles.display) classes.push(styles.display);
  if (styles.flexDirection) classes.push(styles.flexDirection);
  if (styles.justifyContent) classes.push(styles.justifyContent);
  if (styles.alignItems) classes.push(styles.alignItems);
  
  if (styles.margin) classes.push(styles.margin);
  if (styles.padding) classes.push(styles.padding);
  
  if (styles.fontSize) classes.push(styles.fontSize);
  if (styles.fontWeight) classes.push(styles.fontWeight);
  if (styles.textAlign) classes.push(styles.textAlign);
  
  if (styles.backgroundColor) classes.push(styles.backgroundColor);
  if (styles.textColor) classes.push(styles.textColor);
  
  if (styles.borderRadius) classes.push(styles.borderRadius);
  if (styles.borderWidth) classes.push(styles.borderWidth);
  if (styles.borderColor) classes.push(styles.borderColor);
  
  if (styles.boxShadow) classes.push(styles.boxShadow);
  if (styles.opacity) classes.push(styles.opacity);
  
  if (styles.width) classes.push(styles.width);
  if (styles.height) classes.push(styles.height);
  
  return classes.join(' ');
}
