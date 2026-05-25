import { z } from "zod";

export const createEquipamentoSchema = z.object({
  unidadeId: z.string().min(1, "Unidade obrigatória."),
  nome: z
    .string()
    .min(3, "Nome obrigatório.")
    .transform((v) => v.trim()),
  codigo: z
    .string()
    .min(3, "Código obrigatório.")
    .transform((v) => v.trim().toUpperCase()),
  localizacao: z
    .string()
    .optional()
    .transform((v) => v?.trim() || null),
  ip: z
    .string()
    .optional()
    .transform((v) => v?.trim() || null),
});
