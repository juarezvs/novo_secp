import { signOut } from '@/auth'
import { ProfileSwitcher } from './profile-switcher'

type HeaderProps = {
  userName?: string | null
  activeProfileId: string | null
  activeProfileName?: string | null
  perfis: Array<{
    id: string
    nome: string
    unidadeSigla: string | null
  }>
}

export function Header({
  userName,
  activeProfileId,
  activeProfileName,
  perfis,
}: HeaderProps) {
  async function logout() {
    'use server'

    await signOut({
      redirectTo: '/login',
    })
  }

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <p className="text-sm text-slate-500">Bem-vindo</p>
        <h2 className="text-lg font-semibold text-slate-900">
          {userName ?? 'Usuário'}
        </h2>
        <p className="text-xs text-slate-500">
          Perfil ativo: {activeProfileName ?? 'não selecionado'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <ProfileSwitcher
          activeProfileId={activeProfileId}
          perfis={perfis}
        />

        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Sair
          </button>
        </form>
      </div>
    </header>
  )
}