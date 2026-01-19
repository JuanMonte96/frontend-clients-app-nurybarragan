export const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const getTimezoneInfo = () => {
  return {
    timezone: getUserTimezone(),
    timestamp: new Date().toISOString(),
  };
};

/**
 * Convierte una fecha de una zona horaria a otra
 * @param {string|Date} date - La fecha a convertir
 * @param {string} fromTimezone - Zona horaria de origen (ej: "Europe/Paris")
 * @param {string} toTimezone - Zona horaria destino (ej: "America/Bogota")
 * @returns {Date} - La fecha convertida
 */
export const convertDateBetweenTimezones = (date, fromTimezone, toTimezone) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Obtener la fecha en formato ISO (UTC)
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: fromTimezone,
  });

  const parts = formatter.formatToParts(dateObj);
  const dateMap = {};
  parts.forEach(({ type, value }) => {
    dateMap[type] = value;
  });

  // Crear una fecha UTC basada en la hora local de la zona origen
  const utcDate = new Date(
    `${dateMap.year}-${dateMap.month}-${dateMap.day}T${dateMap.hour}:${dateMap.minute}:${dateMap.second}Z`
  );

  // Convertir a la zona horaria destino
  const finalFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: toTimezone,
  });

  return utcDate;
};

/**
 * Convierte una fecha de una zona horaria a otra y la formatea
 * @param {string|Date} dateString - La fecha a convertir (en UTC)
 * @param {string} fromTimezone - Zona horaria de origen (donde está la clase en la BD, ej: "Europe/Paris")
 * @param {string} toTimezone - Zona horaria destino (donde vive el usuario, ej: "America/Bogota")
 * @param {string} locale - Locale para formatear (ej: "es-CO")
 * @returns {string} - La fecha formateada en la zona horaria destino
 */
export const formatDateInTimezone = (dateString, fromTimezone, toTimezone, locale = "es-CO") => {
  const date = new Date(dateString);

  // Paso 1: Obtener qué hora es en UTC
  const utcFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // Paso 2: Obtener qué hora es en la zona de origen (fromTimezone)
  const fromFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: fromTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // Parsear ambas representaciones
  const utcParts = utcFormatter.formatToParts(date);
  const fromParts = fromFormatter.formatToParts(date);

  const utcMap = {};
  const fromMap = {};

  utcParts.forEach(({ type, value }) => {
    utcMap[type] = value;
  });

  fromParts.forEach(({ type, value }) => {
    fromMap[type] = value;
  });

  // Paso 3: Calcular el offset entre UTC y fromTimezone
  // Este offset representa la diferencia horaria
  const utcTime = new Date(
    `${utcMap.year}-${utcMap.month}-${utcMap.day}T${utcMap.hour}:${utcMap.minute}:${utcMap.second}Z`
  );
  const fromTime = new Date(
    `${fromMap.year}-${fromMap.month}-${fromMap.day}T${fromMap.hour}:${fromMap.minute}:${fromMap.second}Z`
  );

  const offsetMs = fromTime - utcTime;

  // Paso 4: Ajustar la fecha restando el offset para obtener la hora correcta
  const adjustedDate = new Date(date.getTime() - offsetMs);

  // Paso 5: Formatear en la zona destino (toTimezone)
  const toFormatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: toTimezone,
  });

  return toFormatter.format(adjustedDate);
};

/**
 * Obtiene la hora en una zona horaria específica
 * @param {string|Date} date - La fecha a convertir
 * @param {string} timezone - Zona horaria (ej: "America/Bogota")
 * @returns {string} - La hora en formato HH:mm
 */
export const getTimeInTimezone = (date, timezone) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: timezone,
  });

  return formatter.format(dateObj);
};
