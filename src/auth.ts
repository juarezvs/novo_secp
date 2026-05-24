import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./shared/lib/prisma";
import { validateLdapCredentials } from "@/lib/auth/ldap";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "database",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      name: "Active Directory",
      credentials: {
        username: {
          label: "Usuário",
          type: "text",
        },
        password: {
          label: "Senha",
          type: "password",
        },
      },

      async authorize(credentials) {
        const username = String(credentials?.username ?? "").trim();
        const password = String(credentials?.password ?? "");

        if (!username || !password) {
          return null;
        }

        const ldapUser = await validateLdapCredentials({
          username,
          password,
        });

        if (!ldapUser) {
          return null;
        }

        const usuario = await prisma.usuario.upsert({
          where: {
            login: ldapUser.username,
          },
          update: {
            nome: ldapUser.name,
            email: ldapUser.email,
            adUsername: ldapUser.username,
            ativo: true,
            ultimoAcessoEm: new Date(),
          },
          create: {
            nome: ldapUser.name,
            email: ldapUser.email,
            login: ldapUser.username,
            adUsername: ldapUser.username,
            ativo: true,
            ultimoAcessoEm: new Date(),
          },
        });

        return {
          id: usuario.id,
          name: usuario.nome,
          email: usuario.email,
        };
      },
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        const usuarioComPerfis = await prisma.usuario.findUnique({
          where: { id: user.id },
          include: {
            perfilAtivo: true,
            perfis: {
              where: { ativo: true },
              include: {
                perfil: true,
                unidade: true,
              },
            },
          },
        });

        session.user.activeProfileId =
          usuarioComPerfis?.perfilAtivo?.perfilId ?? null;

        session.user.perfis =
          usuarioComPerfis?.perfis.map((usuarioPerfil) => ({
            id: usuarioPerfil.perfil.id,
            nome: usuarioPerfil.perfil.nome,
            tipo: usuarioPerfil.perfil.tipo,
            unidadeId: usuarioPerfil.unidadeId,
            unidadeSigla: usuarioPerfil.unidade?.sigla ?? null,
          })) ?? [];
      }

      return session;
    },
  },
});
