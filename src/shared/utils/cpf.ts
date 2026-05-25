export function normalizeCpf(cpf: string) {
  return cpf.replace(/\D/g, "");
}

export function isValidCpfFormat(cpf: string) {
  return normalizeCpf(cpf).length === 11;
}
