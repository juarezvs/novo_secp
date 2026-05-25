import { z } from "zod";
import { TipoMarcacao } from "@prisma-generated/client";
import { normalizeCpf } from "@/shared/utils/cpf";

export const biometriaMarcacaoSchema = z.object({
  codigoEquipamento: z.string().min(1, "Código do equipamento obrigatório."),
  cpf: z
    .string()
    .transform(normalizeCpf)
    .refine((value) => value.length === 11, "CPF inválido."),
  tipo: z.nativeEnum(TipoMarcacao),
  dataHora: z.string().datetime("Data/hora inválida. Use ISO-8601."),
});
