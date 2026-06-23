export type AddressType = "shipping" | "billing" | "company";

export type AccountRole = "bidder" | "seller" | "admin";

export type AccountProfile = {
  id: string;
  display_name: string;
  email: string | null;
  phone: string | null;
  roles: AccountRole[];
};

export type CompanyProfile = {
  id?: string;
  company_name: string;
  legal_name: string | null;
  website_url: string | null;
  support_email: string | null;
  support_phone: string | null;
};

export type AddressInput = {
  id?: string;
  type: AddressType;
  name: string | null;
  line1: string;
  line2: string | null;
  city: string;
  region: string | null;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default_shipping: boolean;
  is_default_billing: boolean;
};
