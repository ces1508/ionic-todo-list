/**
 * Remueve acentos y diacríticos, convierte a lowercase
 * y normaliza espacios.
 */
export const normalizeString = (text: string): string => {
  return text
    .normalize('NFD')                 // separa letras y acentos
    .replace(/[\u0300-\u036f]/g, '')  // elimina diacríticos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');            // espacios múltiples → uno
};