/**
 * Convierte la fecha de javascript a epochtime
 * para mejorar busquedad en rangos de fecha
 * @param date: Date
 * @returns epochtime 
 * 
 * @example 
 *  dateToEpoch(new Date()) // 1772201556
 */
export const dateToEpoch = (date: Date): number =>  Math.floor(date.getTime()/1000.0)