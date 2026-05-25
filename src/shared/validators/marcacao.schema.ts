import { z } from "zod";
import { TipoMarcacao } from "@prisma-generated/client";

export const createMarcacaoSchema = z.object({
  tipo: z.nativeEnum(TipoMarcacao),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});
