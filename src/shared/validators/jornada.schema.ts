import { z } from "zod";
import { TipoJornada } from "@prisma-generated/client";

export const createJornadaSchema = z
  .object({
    nome: z.string().min(3, "Nome obrigatório."),
    tipo: z.nativeEnum(TipoJornada),
    cargaHoras: z.coerce
      .number()
      .min(1, "Carga mínima inválida.")
      .max(12, "Carga máxima inválida."),
    exigeIntervalo: z
      .union([z.literal("on"), z.undefined()])
      .transform((value) => value === "on"),
    intervaloMin: z.coerce.number().min(0).optional(),
    intervaloMax: z.coerce.number().min(0).optional(),
    horarioInicioPadrao: z.string().optional(),
    horarioFimPadrao: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.exigeIntervalo) {
      if (!data.intervaloMin || !data.intervaloMax) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Intervalo mínimo e máximo são obrigatórios.",
          path: ["intervaloMin"],
        });
      }

      if (
        data.intervaloMin &&
        data.intervaloMax &&
        data.intervaloMin > data.intervaloMax
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Intervalo mínimo não pode ser maior que o máximo.",
          path: ["intervaloMin"],
        });
      }
    }
  });
