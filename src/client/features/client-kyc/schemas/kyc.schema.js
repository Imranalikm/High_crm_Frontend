import { z } from 'zod';

const requiredText = (label) => z.string().trim().min(1, `${label} is required`);

export const personalInfoSchema = z.object({
  fullName: requiredText('Full name'),
  dateOfBirth: requiredText('Date of birth'),
  email: z.string().email('Enter a valid email address'),
  phone: requiredText('Phone number'),
  country: requiredText('Country'),
  address: requiredText('Address'),
  city: requiredText('City'),
  postalCode: requiredText('Postal code'),
});

export const identityDocumentSchema = z.object({
  type: z.enum(['passport', 'national-id', 'driving-license']),
  documentNumber: requiredText('Document number'),
  expiryDate: requiredText('Expiry date'),
  issuingCountry: requiredText('Issuing country'),
  front: z.any().refine(Boolean, 'Front side is required'),
  back: z.any().optional(),
}).refine((data) => {
  if (data.type !== 'passport' && !data.back) {
    return false;
  }
  return true;
}, {
  message: 'Back side is required',
  path: ['back'],
});

export const addressProofSchema = z.object({
  type: z.enum(['utility-bill', 'bank-statement', 'rent-agreement']),
  issueDate: requiredText('Issue date'),
  file: z.any().refine(Boolean, 'Proof of address is required'),
});

export const kycSubmissionSchema = z.object({
  personalInfo: personalInfoSchema,
  identityDocument: identityDocumentSchema,
  selfie: z.any().refine(Boolean, 'Selfie verification is required'),
  addressProof: addressProofSchema,
  declaration: z.literal(true, { error: 'Accept the declaration before submitting' }),
});

export function validateSection(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) return {};
  return Object.fromEntries(result.error.issues.map((issue) => [issue.path.join('.'), issue.message]));
}
