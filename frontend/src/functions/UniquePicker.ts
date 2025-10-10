// UniquePicker.ts
export class UniquePicker {
  private pools: Record<string, number[]> = {};

  constructor(private mensajes: Record<string, string[]>) {}

  pick(tipo: string, templateIndex?: number) {
    const arr = this.mensajes[tipo] || [];
    if (!arr.length) return "";

    if (templateIndex != null && templateIndex >= 0 && templateIndex < arr.length) {
      return arr[templateIndex];
    }

    if (!this.pools[tipo] || this.pools[tipo].length === 0) {
      // Crea un nuevo orden aleatorio
      this.pools[tipo] = [...Array(arr.length).keys()];
      for (let i = this.pools[tipo].length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.pools[tipo][i], this.pools[tipo][j]] = [this.pools[tipo][j], this.pools[tipo][i]];
      }
    }
    const idx = this.pools[tipo].pop()!;
    return arr[idx];
  }
}
