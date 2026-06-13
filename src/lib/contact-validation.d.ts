export type ContactRequest = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
};

export type ContactValidationResult = {
  valid: boolean;
  errors: Partial<Record<"name" | "email" | "message", string>>;
};

export function validateContactRequest(values: ContactRequest): ContactValidationResult;
