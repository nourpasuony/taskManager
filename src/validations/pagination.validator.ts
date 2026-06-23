import { z } from "zod";

export const paginationSchema = z.object({
  page: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .pipe(z.number().int().positive())
    .default(1),
  limit: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .pipe(z.number().int().min(1).max(100))
    .default(10),
}).partial();

export type PaginationInputType = z.infer<typeof paginationSchema>;

// Helper to calculate pagination
export const calculatePagination = (page: number, limit: number, total: number) => {
  const totalPages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    skip,
    hasNextPage,
    hasPrevPage,
  };
};

export type PaginationResponseType = ReturnType<typeof calculatePagination>;
