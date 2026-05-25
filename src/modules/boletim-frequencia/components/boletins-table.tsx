import { BoletimActions } from "./boletim-actions";

type BoletimItem = {
  id: string;
  ano: number;
  mes: number;
  status: string;
  geradoEm: Date | null;
  enviadoEm: Date | null;
  unidade: {
    sigla: string;
    nome: string;
  };
  homologacao: {
    id: string;
    status: string;
    homologadaEm: Date | null;
    homologador: {
      nome: string;
    } | null;
    servidores: Array<{
      possuiPendencia: boolean;
      homologado: boolean;
      servidor: {
        nomeFuncional: string;
        matricula: string;
      };
    }>;
  };
};

type Props = {
  boletins: BoletimItem[];
};

function formatarData(data: Date | null) {
  if (!data) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(data);
}

export function BoletinsTable({ boletins }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Boletins de Frequência
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Competência</th>
              <th className="px-4 py-3">Unidade</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Servidores</th>
              <th className="px-4 py-3">Homologador</th>
              <th className="px-4 py-3">Gerado</th>
              <th className="px-4 py-3">Enviado</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {boletins.map((boletim) => (
              <tr key={boletim.id}>
                <td className="px-4 py-3 font-semibold">
                  {String(boletim.mes).padStart(2, "0")}/{boletim.ano}
                </td>
                <td className="px-4 py-3">{boletim.unidade.sigla}</td>
                <td className="px-4 py-3">{boletim.status}</td>
                <td className="px-4 py-3">
                  {boletim.homologacao.servidores.length}
                </td>
                <td className="px-4 py-3">
                  {boletim.homologacao.homologador?.nome ?? "-"}
                </td>
                <td className="px-4 py-3">{formatarData(boletim.geradoEm)}</td>
                <td className="px-4 py-3">{formatarData(boletim.enviadoEm)}</td>
                <td className="px-4 py-3">
                  <BoletimActions
                    homologacaoId={boletim.homologacao.id}
                    boletimId={boletim.id}
                    statusHomologacao={boletim.homologacao.status}
                    statusBoletim={boletim.status}
                  />
                </td>
              </tr>
            ))}

            {boletins.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Nenhum boletim localizado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
