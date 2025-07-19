export class transactionutils {
  constructor(db) {
    this.db = db;
  }

  async eliminartransaccionesrelacionadas(categoryid) {
    const transacciones = await this.db.obtenertodos('transactions');
    const vinculadas = transacciones.filter(tx => tx.categoryid === categoryid);
    for (const tx of vinculadas) {
      await this.db.eliminar('transactions', tx.id);
    }
  }

  async transaccionesporcategoria(categoryid) {
    const todas = await this.db.obtenertodos('transactions');
    return todas.filter(tx => tx.categoryid === categoryid);
  }

  async guardartransaccion(transaccion) {
    // puedes validar estructura antes de guardar
    await this.db.agregar('transactions', transaccion);
  }

  async eliminartransaccion(id) {
    await this.db.eliminar('transactions', id);
  }

  async actualizarelemento(transaccion) {
    await this.db.actualizar('transactions', transaccion);
  }
}
