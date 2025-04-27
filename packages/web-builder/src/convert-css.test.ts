import { describe, expect, it } from 'vitest';
import { sanitizeClassName } from './convert-css';

describe('sanitizeClassName', () => {
  it('should convert camelCase to snake_case', () => {
    expect(sanitizeClassName('fontItalic')).toBe('font_italic');
    expect(sanitizeClassName('myTestClass')).toBe('my_test_class');
  });

  it('should replace parentheses with underscores', () => {
    expect(sanitizeClassName('example(test)')).toBe('example_test');
    expect(sanitizeClassName('(text)Example')).toBe('text_example');
  });

  it('should replace spaces and commas with underscores', () => {
    expect(sanitizeClassName('hello world')).toBe('hello_world');
    expect(sanitizeClassName('test,example')).toBe('test_example');
  });

  it('should replace dots with underscores', () => {
    expect(sanitizeClassName('file.name')).toBe('file_name');
    expect(sanitizeClassName('tools.version.1')).toBe('tools_version_1');
  });

  it('should handle mixed cases of all transformations', () => {
    expect(sanitizeClassName('myTest,Case File(name).js')).toBe('my_test_case_file_name_js');
  });

  it('should return an empty string if the input is undefined or empty', () => {
    expect(sanitizeClassName('')).toBe('');
    expect(sanitizeClassName(undefined as unknown as string)).toBe('');
  });

  it('should handle multiple special characters in a row and normalize them to a single underscore', () => {
    expect(sanitizeClassName('font____size...large')).toBe('font_size_large');
    expect(sanitizeClassName('foo,..bar()')).toBe('foo_bar');
  });
});
