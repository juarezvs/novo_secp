export function diferencaEmMinutos(inicio: Date, fim: Date) {
    return Math.max(0, Math.floor((fim.getTime() - inicio.getTime()) / 60000))
  }
  
  export function inicioDoDia(data: Date) {
    return new Date(data.getFullYear(), data.getMonth(), data.getDate())
  }
  
  export function fimDoDia(data: Date) {
    return new Date(
      data.getFullYear(),
      data.getMonth(),
      data.getDate(),
      23,
      59,
      59,
      999,
    )
  }
  
  export function minutosParaHoraTexto(minutos: number) {
    const negativo = minutos < 0
    const abs = Math.abs(minutos)
    const h = Math.floor(abs / 60)
    const m = abs % 60
  
    return `${negativo ? '-' : ''}${String(h).padStart(2, '0')}h${String(m).padStart(2, '0')}`
  }