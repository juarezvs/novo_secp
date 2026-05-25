import { z } from 'zod'

export const createUnidadeSchema = z.object({
  orgaoId: z.string().min(1, 'Órgão obrigatório.'),
  unidadePaiId: z.string().optional().transform((v) => v || null),
  sigla: z.string().min(2, 'Sigla obrigatória.').transform((v) => v.trim().toUpperCase()),
  nome: z.string().min(3, 'Nome obrigatório.').transform((v) => v.trim()),
  tipo: z.string().min(2, 'Tipo obrigatório.').transform((v) => v.trim().toUpperCase()),
})