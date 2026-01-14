/**
 * Obtiene la zona horaria actual del usuario
 * @returns {string} Zona horaria en formato IANA (ej: "America/Bogota")
 */
export const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Obtiene información completa de timezone
 * @returns {object} Objeto con timezone IANA
 */
export const getTimezoneInfo = () => {
  return {
    timezone: getUserTimezone(),
    timestamp: new Date().toISOString(),
  };
};
