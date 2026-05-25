import { z } from "zod";
import { normalizeCpf } from "@/shared/utils/cpf";

export const createServidorSchema = z.object({
  nome: z.string().min(3, "Nome obrigatório."),
  login: z.string().min(3, "Login obrigatório.").toLowerCase(),
  email: z.string().email("E-mail inválido.").optional().or(z.literal("")),
  matricula: z.string().min(1, "Matrícula obrigatória."),
  cpf: z
    .string()
    .transform(normalizeCpf)
    .refine((value) => value.length === 11, "CPF deve ter 11 dígitos."),
  cargo: z.string().optional(),
  funcao: z.string().optional(),
  unidadeId: z.string().min(1, "Unidade obrigatória."),
  jornadaId: z.string().min(1, "Jornada obrigatória."),
});
