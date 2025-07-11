function numeroALetras(num) {
  num = Number(num);
  if (isNaN(num)) {
    return 'CERO SOLES';
  }

  const unidades = ['CERO', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const decenas = ['DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const especiales = {
    10: 'DIEZ', 11: 'ONCE', 12: 'DOCE', 13: 'TRECE', 14: 'CATORCE', 15: 'QUINCE',
    16: 'DIECISEIS', 17: 'DIECISIETE', 18: 'DIECIOCHO', 19: 'DIECINUEVE', 20: 'VEINTE', 100: 'CIEN'
  };

  function convertir(n) {
    if (n === 0) return 'CERO';
    if (n < 10) return unidades[n];
    if (especiales[n]) return especiales[n];
    if (n < 30) return 'VEINTI' + unidades[n - 20].toLowerCase();
    if (n < 100) {
      const d = Math.floor(n / 10);
      const u = n % 10;
      return decenas[d - 1] + (u > 0 ? ' Y ' + unidades[u] : '');
    }
    if (n < 200) return 'CIENTO' + (n % 100 > 0 ? ' ' + convertir(n % 100) : '');
    if (n < 1000) {
      const c = Math.floor(n / 100);
      const r = n % 100;
      return unidades[c] + 'CIENTOS' + (r > 0 ? ' ' + convertir(r) : '');
    }
    if (n === 1000) return 'MIL';
    if (n < 2000) return 'MIL' + (n % 1000 > 0 ? ' ' + convertir(n % 1000) : '');
    if (n < 1000000) {
      const miles = Math.floor(n / 1000);
      const resto = n % 1000;
      return convertir(miles) + ' MIL' + (resto > 0 ? ' ' + convertir(resto) : '');
    }
    if (n === 1000000) return 'UN MILLÓN';
    if (n < 2000000) return 'UN MILLÓN' + (n % 1000000 > 0 ? ' ' + convertir(n % 1000000) : '');
    return convertir(Math.floor(n / 1000000)) + ' MILLONES' + (n % 1000000 > 0 ? ' ' + convertir(n % 1000000) : '');
  }

  const partes = num.toFixed(2).split('.');
  const enteros = parseInt(partes[0], 10);
  const decimales = parseInt(partes[1], 10);

  const letras = `${convertir(enteros).trim()} SOLES`;
  const centimos = decimales > 0 ? ` CON ${convertir(decimales).trim()} CÉNTIMOS` : '';

  return letras + centimos;
}

module.exports = {
  numeroALetras
};
