import fs from 'fs';
import path from 'path';
import { RawAccountSchema, RawAccount } from '@/types/account';
import { analizarFinanzas } from './financial-analyzer';

// Leer archivo datos.csv
const csvPath = path.join(process.cwd(), 'public', 'data', 'datos.csv');
const fileContent = fs.readFileSync(csvPath, 'utf-8');

const lines = fileContent.trim().split('\n');
const headers = lines[0].split(',').map((h) => h.trim());

const rawAccounts: RawAccount[] = [];

for (let i = 1; i < lines.length; i++) {
  const currentLine = lines[i].trim();
  if (!currentLine) continue;

  const values = currentLine.split(',').map((v) => v.trim());
  const obj: Record<string, unknown> = {};

  headers.forEach((header, index) => {
    obj[header] = values[index];
  });

  const parsed = RawAccountSchema.parse(obj);
  rawAccounts.push(parsed);
}

console.log('--------------------------------------------------');
console.log('🚀 PRUEBA DEL MOTOR FINANCIERO CON datos.csv');
console.log('--------------------------------------------------');

const resultado = analizarFinanzas(rawAccounts);

console.log('\n✅ RESULTADO DEL PROCESAMIENTO:');
console.log(`- Total Activo: $${resultado.balanceGeneral.totalActivo}`);
console.log(`- Total Pasivo + Patrimonio: $${resultado.balanceGeneral.totalPasivoMasPatrimonio}`);
console.log(`- Razón Circulante (X1): ${resultado.ratios.liquidez.razonCirculante}`);
console.log(`- Apalancamiento Interno (X2): ${resultado.ratios.apalancamiento.apalancamientoInterno}`);
console.log(`- Valor Z: ${resultado.modeloZ.valorZ}`);
console.log(`- Dictamen: ${resultado.modeloZ.categoriaRiesgo}`);
