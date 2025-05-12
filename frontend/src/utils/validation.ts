export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  password?: boolean;
  match?: string;
  custom?: (value: string) => boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export const validateField = (
  value: string,
  rules: ValidationRules,
  fieldName: string,
  formData?: Record<string, string>
): string | null => {
  if (rules.required && !value) {
    return `${fieldName} is required`;
  }

  if (value) {
    if (rules.minLength && value.length < rules.minLength) {
      return `${fieldName} must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `${fieldName} must be at most ${rules.maxLength} characters`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return `${fieldName} is invalid`;
    }

    if (rules.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return 'Invalid email address';
    }

    if (rules.password) {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumbers = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        return 'Password must contain uppercase, lowercase, number, and special character';
      }
    }

    if (rules.match && formData && value !== formData[rules.match]) {
      return `${fieldName} must match ${rules.match}`;
    }

    if (rules.custom && !rules.custom(value)) {
      return `${fieldName} is invalid`;
    }
  }

  return null;
};

export const validateForm = (
  formData: Record<string, string>,
  validationRules: Record<string, ValidationRules>
): ValidationError[] => {
  const errors: ValidationError[] = [];

  Object.entries(validationRules).forEach(([field, rules]) => {
    const error = validateField(formData[field], rules, field, formData);
    if (error) {
      errors.push({ field, message: error });
    }
  });

  return errors;
};

// Common validation rules
export const commonRules = {
  email: {
    required: true,
    email: true,
  },
  password: {
    required: true,
    minLength: 8,
    password: true,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  confirmPassword: {
    required: true,
    match: 'password',
  },
}; 