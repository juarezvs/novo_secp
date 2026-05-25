import { z } from 'zod'
import { TipoMarcacao } from '@prisma-generated/client'

export const createSolicitacaoAjustePontoSchema = z.object({
  data: z.string().min(1, 'Data obrigatória.'),
  hora: z.string().min(1, 'Hora obrigatória.'),
  tipoMarcacao: z.nativeEnum(TipoMarcacao),
  justificativa: z.string().min(10, 'Justificativa deve ter pelo menos 10 caracteres.'),
})

export const decidirSolicitacaoSchema = z.object({
    solicitacaoId: z.string().min(1, 'Solicitação obrigatória.'),
    decisao: z.enum(['APROVAR', 'INDEFERIR']),
    observacao: z.string().optional().transform((v) => v?.trim() || null),
  })