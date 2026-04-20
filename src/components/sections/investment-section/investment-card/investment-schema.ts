/**
 * Investment Form Schema – Pure Module
 * ====================================
 *
 * Builds zod schema for buy/sell amount and currency. No React.
 * Used by InvestmentCard: useForm({ resolver: zodResolver(getInvestmentSchema(t, min)) }).
 */

import { z } from 'zod';

/** Translation-like function; second arg for interpolation (e.g. i18n t(key, { minAmount })). */
export type TFunction = (key: string, options?: Record<string, unknown>) => string;

/**
 * Returns zod schema for investment form.
 * Buy amount: min check + minimum investment. Sell amount: positive number only.
 */
export function getInvestmentSchema(t: TFunction, minimumDepositAmount: string | undefined) {
  const buyAmountSchema = z
    .string()
    .min(1, { message: t('investment:amountRequired') })
    .superRefine((val, ctx) => {
      const numValue = Number.parseFloat(val);
      if (numValue <= 0 || Number.isNaN(numValue)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('investment:amountMustBeGreaterThanZero'),
        });
        return;
      }
      if (!minimumDepositAmount) return;
      const minAmount = Number.parseFloat(minimumDepositAmount);
      if (Number.isNaN(minAmount)) {
        return;
      }
      if (numValue < minAmount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            t('Amount Must Be Greater Than Minimum Investment', {
              minAmount: minimumDepositAmount,
            }) || `Amount must be at least ${minimumDepositAmount}`,
        });
      }
    });

  const sellAmountSchema = z
    .string()
    .min(1, { message: t('investment:amountRequired') })
    .refine(
      (val) => {
        const numValue = Number.parseFloat(val.replaceAll(',', ''));
        return numValue > 0 && !Number.isNaN(numValue);
      },
      { message: t('investment:amountMustBeGreaterThanZero') }
    );

  return z.object({
    buyAmount: buyAmountSchema,
    sellAmount: sellAmountSchema,
    currency: z.object({
      label: z.string(),
      value: z.string(),
    }),
  });
}
