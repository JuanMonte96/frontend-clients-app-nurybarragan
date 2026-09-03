const HTTP_MESSAGES = {
  400: "La solicitud no es válida. Revisa los datos e inténtalo nuevamente.",
  401: "Tu sesión no es válida o ha expirado. Inicia sesión nuevamente.",
  403: "No tienes permisos para realizar esta acción.",
  404: "No se encontró el recurso solicitado.",
  409: "La información entra en conflicto con un registro existente.",
  422: "Algunos datos no son válidos. Revísalos e inténtalo nuevamente.",
  429: "Se han realizado demasiadas solicitudes. Espera un momento e inténtalo nuevamente.",
  500: "Ocurrió un error en el servidor. Inténtalo nuevamente.",
  502: "El servidor no está disponible en este momento. Inténtalo nuevamente.",
  503: "El servicio no está disponible temporalmente. Inténtalo nuevamente.",
};

const isTechnicalMessage = (value) => {
  const message = String(value || "").toLowerCase();
  return /stack|sql|sequelize|database|column .* does not exist|syntax error|node_modules| at [a-z]:|internal server error/.test(message);
};

const flattenMessage = (value) => {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => flattenMessage(item).split("\n"))
      .map((item) => item.trim())
      .filter(Boolean)
      .join("\n");
  }
  if (value && typeof value === "object") {
    if (typeof value.message === "string") return value.message.trim();
    if (value.message) return flattenMessage(value.message);
    if (typeof value.error === "string") return value.error.trim();
    if (value.error) return flattenMessage(value.error);
    return Object.values(value)
      .map((item) => flattenMessage(item))
      .filter(Boolean)
      .join("\n");
  }
  return "";
};

export const getErrorMessage = (error, fallback = "No fue posible completar la operación.") => {
  if (error?.userMessage) return error.userMessage;

  if (!error?.response) {
    if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT" || /timeout/i.test(error?.message || "")) {
      return "La solicitud tardó demasiado. Inténtalo nuevamente.";
    }
    if (error?.request) return "No fue posible conectar con el servidor. Inténtalo nuevamente.";
    return flattenMessage(error?.message) || fallback;
  }

  const { data, status } = error.response;
  const backendMessage = flattenMessage(data?.message) || flattenMessage(data?.errors) || flattenMessage(data?.error);
  if (backendMessage && !isTechnicalMessage(backendMessage)) return backendMessage;
  return HTTP_MESSAGES[status] || fallback;
};

export const getErrorMessages = (error) => getErrorMessage(error).split("\n").filter(Boolean);
