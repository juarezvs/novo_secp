import { TipoMarcacao } from "@prisma-generated/client";
import { RegistroPontoButton } from "./registro-ponto-button";

export function RegistroPontoCard() {
  const botoes = [
    {
      tipo: TipoMarcacao.ENTRADA,
      label: "Registrar entrada",
    },
    {
      tipo: TipoMarcacao.SAIDA_INTERVALO,
      label: "Saída intervalo",
    },
    {
      tipo: TipoMarcacao.RETORNO_INTERVALO,
      label: "Retorno intervalo",
    },
    {
      tipo: TipoMarcacao.SAIDA,
      label: "Registrar saída",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Registro de ponto
      </h2>

      <p className="mt-2 text-sm text-slate-600">
        Registre entrada, intervalo e saída. A integração biométrica será
        acoplada posteriormente.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {botoes.map((botao) => (
          <RegistroPontoButton
            key={botao.tipo}
            tipo={botao.tipo}
            label={botao.label}
          />
        ))}
      </div>
    </div>
  );
}
