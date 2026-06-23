import z from "zod";
import {
  paymentMethodEnum,
  RecurringIntervalEnum,
  TransactionTypeEnum,
} from "../enums/transaction-Type.enum";

export const transactionIdSchema = z.string().trim().min(1);

export const baseTransactionSchema = z.object({
  type: z.enum([TransactionTypeEnum.INCOME, TransactionTypeEnum.EXPENSE], {
    errorMap: () => ({
      message: "Transaction type must either INCOME or EXPENSE",
    }),
  }),
  title: z.string().min(1, "Title is required"),
  amount: z.number().positive("Amount must be postive").min(1),
  category: z.string().min(1, "Category is required"),
  receiptUrl: z.string().optional(),
  recurringInterval: z
    .enum([
      RecurringIntervalEnum.DAILY,
      RecurringIntervalEnum.WEEKLY,
      RecurringIntervalEnum.MONTHLY,
      RecurringIntervalEnum.YEARLY,
    ])
    .nullable()
    .optional(),
  isRecurring: z.boolean().default(false),
  description: z.string().optional(),
  date: z
    .union([z.string().datetime({ message: "Invalid date string" }), z.date()])
    .transform((val) => new Date(val)),

  paymentMethod: z
    .enum([
      paymentMethodEnum.CARD,
      paymentMethodEnum.BANK_TRANSFER,
      paymentMethodEnum.MOBILE_PAYMENT,
      paymentMethodEnum.AUTO_DEBIT,
      paymentMethodEnum.CASH,
      paymentMethodEnum.OTHER,
    ])
    .default(paymentMethodEnum.CASH),
});

export const createTransactionSchema = baseTransactionSchema;

export const updateTransactionSchema = baseTransactionSchema.partial();

export const bulkDeleteTransactionSchema = z.object({
  transactionIds: z
    .array(z.string().length(24, "Invalid transaction ID format"))
    .min(1, "At least one transaction ID must be provided"),
});

export const bulkTransactionSchema = z.object({
  transactions: z
    .array(baseTransactionSchema)
    .min(1, "At least one transaction is required")
    .max(300, "Must not be more than 300 transactions")
    .refine(
      (txs) =>
        txs.every((tx) => {
          const amount = Number(tx.amount);
          return !isNaN(amount) && amount > 0 && amount <= 1_000_000_000;
        }),
      {
        message: "Amount must be a postive number",
      }
    ),
});

export type CreateTransactionType = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionType = z.infer<typeof updateTransactionSchema>;
export type BulkDelTransactionType = z.infer<
  typeof bulkDeleteTransactionSchema
>;
