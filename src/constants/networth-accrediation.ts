import { TSelectOption } from "@/components/atoms/select-box";
import { COUNTRY_OPTIONS, STATE_OPTIONS } from '@/constants/country-states';
import { DateFormat, DEFAULT_DATE_FORMAT } from '@/constants/date-formats';
import { cityName } from '@/regex';
import dayjs from 'dayjs';
import { z } from 'zod';

// =============================================================================
// FORM STYLES (Responsive 2-column layout)
// =============================================================================

export const FORM_ROW_STYLES = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: { xs: 3, md: 4 },
  width: '100%',
} as const;

export const FORM_FIELD_STYLES = {
  flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' },
  minWidth: 0,
} as const;

export const FULL_WIDTH_FIELD_STYLES = {
  flex: '1 1 100%',
  minWidth: 0,
} as const;

// =============================================================================
// FORM DEFAULT VALUES
// =============================================================================

export const ACCREDITATION_DEFAULT_VALUES = {
  accountRegistration: '',
  type: undefined,
  domesticYN: undefined,
  entityType: undefined,
  firstName: '',
  lastName: '',
  dob: '',
  domicile: undefined,
  occupation: '',
  email: '',
  phone: '',
  streetAddress1: '',
  streetAddress2: '',
  country: undefined,
  state: undefined,
  city: '', // Text field
  zip: '',
} as const;

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Field configuration type for dynamic form rendering
 */
export type FieldType = 'text' | 'email' | 'select' | 'phone' | 'date';

export interface BaseFieldConfig {
  name: string;
  label: string;
  placeholder: string;
  type: FieldType;
  fullWidth?: boolean;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text' | 'email';
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select';
  options: TSelectOption[];
}

export interface PhoneFieldConfig extends BaseFieldConfig {
  type: 'phone';
  countryLabel?: string;
  phoneLabel?: string;
}

export interface DateFieldConfig extends BaseFieldConfig {
  type: 'date';
  format?: DateFormat;
  disableFuture?: boolean;
  disablePast?: boolean;
}

export type FieldConfig = TextFieldConfig | SelectFieldConfig | PhoneFieldConfig | DateFieldConfig;



export interface SectionConfig {
  title: string;
  fields: FieldConfig[][];
}


export const STEPS = ['Account Information', 'Document Upload'];

export const DOCUMENT_REQUIREMENTS = [
  'Only one file can be uploaded at a time',
  'File size: 1 KB minimum, 50 MB maximum',
  'Accepted formats: PDF, JPG, JPEG, PNG',
  'Documents must be dated within the last 3 months',
];


export const ACCOUNT_TYPE_OPTIONS: TSelectOption[] = [
    { label: 'Individual', value: 'INDIVIDUAL' },
    { label: 'Entity', value: 'ENTITY' },
    { label: 'TIC', value: 'TIC' },
    { label: 'JTWROS', value: 'JTWROS' },
    { label: 'IRA', value: 'IRA' },
    { label: 'Sep IRA', value: 'SEPIRA' },
    { label: 'ROTH', value: 'ROTH' },
    { label: 'Joint', value: 'JOINT' },
  ];
  
 export const DOMESTIC_OPTIONS: TSelectOption[] = [
    { label: 'Domestic Account', value: 'domestic_account' },
    { label: 'International Account', value: 'international_account' },
  ];
  
 export const ENTITY_TYPE_OPTIONS: TSelectOption[] = [
    { label: 'Revocable Trust', value: 'Revocable Trust' },
    { label: 'Irrevocable Trust', value: 'Irrevocable Trust' },
    { label: 'Limited Partnership', value: 'Limited Partnership' },
    { label: 'LLC', value: 'LLC' },
    { label: 'Corporation', value: 'Corporation' },
  ];
  
 export const DOMICILE_OPTIONS: TSelectOption[] = [
    { label: 'U.S. Citizen', value: 'U.S. Citizen' },
    { label: 'U.S. Resident', value: 'U.S. Resident' },
    { label: 'Non-U.S. Citizen', value: 'non-resident' },
  ];

// =============================================================================
  // FORM SECTIONS CONFIGURATION
  // =============================================================================
  
  /**
   * Configuration for all form sections and their fields
   * Each section contains rows of fields (max 2 fields per row)
   */
  export const FORM_SECTIONS: SectionConfig[] = [
    {
      title: 'Account Information',
      fields: [
        [
          {
            name: 'accountRegistration',
            label: 'Account Registration Name',
            placeholder: 'Enter account registration name',
            type: 'text',
          },
          {
            name: 'type',
            label: 'Account Type',
            placeholder: 'Select account type',
            type: 'select',
            options: ACCOUNT_TYPE_OPTIONS,
          },
        ],
        [
          {
            name: 'domesticYN',
            label: 'Domestic Status',
            placeholder: 'Select domestic status',
            type: 'select',
            options: DOMESTIC_OPTIONS,
          },
          {
            name: 'entityType',
            label: 'Entity Type',
            placeholder: 'Select entity type',
            type: 'select',
            options: ENTITY_TYPE_OPTIONS,
          },
        ],
      ],
    },
    {
      title: 'Personal Information',
      fields: [
        [
          { name: 'firstName', label: 'First Name', placeholder: 'Enter first name', type: 'text' },
          { name: 'lastName', label: 'Last Name', placeholder: 'Enter last name', type: 'text' },
        ],
        [
          { 
            name: 'dob', 
            label: 'Date of Birth', 
            placeholder: 'MM-DD-YYYY', 
            type: 'date',
            format: DEFAULT_DATE_FORMAT,
            disableFuture: true,
          },
          {
            name: 'domicile',
            label: 'Domicile Status',
            placeholder: 'Select domicile status',
            type: 'select',
            options: DOMICILE_OPTIONS,
          },
        ],
        [{ name: 'occupation', label: 'Occupation', placeholder: 'Enter occupation', type: 'text' },
          { name: 'email', label: 'Email Address', placeholder: 'john.doe@email.com', type: 'email' },
        ],
        [
            {
              name: 'phone',
              label: 'Phone Number',
              placeholder: 'Enter phone number',
              type: 'phone',
              countryLabel: 'Country',
              phoneLabel: 'Phone Number',
            },
          ],
      ],
    },
    {
      title: 'Address',
      fields: [
        [
          {
            name: 'streetAddress1',
            label: 'Street Address',
            placeholder: '123 Main Street',
            type: 'text',
            fullWidth: true,
          },
        ],
        [
          {
            name: 'streetAddress2',
            label: 'Street Address 2 (Optional)',
            placeholder: 'Apt 4B',
            type: 'text',
            fullWidth: true,
          },
        ],
        [
          { 
            name: 'country', 
            label: 'Country', 
            placeholder: 'Select country', 
            type: 'select', 
            options: COUNTRY_OPTIONS,
          },
          { name: 'zip', label: 'ZIP / Postal Code', placeholder: '10001', type: 'text' },
        
        ],
        [
          { 
            name: 'state', 
            label: 'State', 
            placeholder: 'Select state', 
            type: 'select', 
            options: STATE_OPTIONS,
          },
          { 
            name: 'city', 
            label: 'City', 
            placeholder: 'Enter city', 
            type: 'text',
          },
          
        ],
      ],
    }
  ];


// =============================================================================
// FORM SCHEMA
// =============================================================================

// Select option schema - value can be string or number (country/state/city use numeric IDs)
const selectOptionSchema = z.object({
    label: z.string(),
    value: z.union([z.string(), z.number()]),
  });

/**
 * Domicile values for conditional validation
 * Country/State are optional for non-US citizens
 */
export const DOMICILE_VALUES = {
  US_CITIZEN: 'US_CITIZEN',
  US_RESIDENT: 'US_RESIDENT',
  NON_US_CITIZEN: 'NON_US_CITIZEN',
} as const;

/**
 * Check if domicile is US-based (citizen or resident)
 */
export const isUSBasedDomicile = (domicileValue: string | number | undefined): boolean => {
  return domicileValue === DOMICILE_VALUES.US_CITIZEN || domicileValue === DOMICILE_VALUES.US_RESIDENT;
};

export type AccreditationFormData = z.infer<typeof accreditationSchema>;

/**
 * Regex pattern for name validation
 * Allowed characters: A-Z, a-z, 0-9, spaces, period (.), ampersand (&), hyphen (-)
 * No emojis or special characters allowed
 * Note: Hyphen (-) is placed at the end of the character class to avoid being interpreted as a range
 */
const NAME_PATTERN = /^[A-Za-z0-9 ,.&-]+$/;

/**
 * Zod schema for name fields with common validation rules:
 * - Minimum 2 characters, maximum 100 characters
 * - No emojis or special characters
 * - Only allows: A-Z, a-z, 0-9, spaces, period (.), ampersand (&), hyphen (-)
 * - No leading or trailing spaces
 */
const createNameSchema = (fieldLabel: string) =>
  z
    .string()
    .min(1, `${fieldLabel} is required`)
    .transform((val) => val.trim()) // Remove leading/trailing spaces
    .pipe(
      z
        .string()
        .min(2, `${fieldLabel} must be at least 2 characters`)
        .max(100, `${fieldLabel} must be less than 100 characters`)
        .regex(NAME_PATTERN, `${fieldLabel} can only contain letters, numbers, spaces, and the special characters: . (period), & (ampersand), - (hyphen) and , (comma)`)
    );

export const accreditationSchema = z.object({
  // Account Information
  accountRegistration: createNameSchema('Account registration name'),
  type: selectOptionSchema.optional().refine((val) => val !== undefined, { message: 'Account type is required' }),
  domesticYN: selectOptionSchema
    .optional()
    .refine((val) => val !== undefined, { message: 'Domestic status is required' }),
  entityType: selectOptionSchema.optional().refine((val) => val !== undefined, { message: 'Entity type is required' }),

  // Personal Information
  firstName: createNameSchema('First name'),
  lastName: createNameSchema('Last name'),
  dob: z
    .string()
    .min(1, 'Date of birth is required')
    .refine(
      (dateStr) => {
        if (!dateStr) return false;
        const birthDate = dayjs(dateStr, DEFAULT_DATE_FORMAT);
        if (!birthDate.isValid()) return false;
        const today = dayjs();
        const age = today.diff(birthDate, 'year');
        return age >= 18;
      },
      { message: 'You must be at least 18 years old' }
    ),
  domicile: selectOptionSchema
    .optional()
    .refine((val) => val !== undefined, { message: 'Domicile status is required' }),
  occupation: z.string().min(1, 'Occupation is required'),

  // Contact Information
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  phone: z.string().min(1, 'Phone number is required'),

  // Address Information
  streetAddress1: z.string().min(1, 'Street address is required'),
  streetAddress2: z.string().optional(),
  country: selectOptionSchema.optional().refine((val) => val !== undefined, { message: 'Country is required' }),
  state: selectOptionSchema.optional().refine((val) => val !== undefined, { message: 'State is required' }),
  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City must be less than 100 characters')
    .regex(cityName.regex, "City must start with a letter and can only contain letters, spaces, - (hyphens) and ' (single quote)"),
  zip: z.string().min(1, 'ZIP/Postal code is required').max(5, 'ZIP/Postal code must be 5 digits'),
});