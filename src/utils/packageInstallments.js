export const getMaxInstallmentsForPackage = (pkg = {}) => {
  const classLimit = Number(pkg?.class_limit ?? 0);
  if (Number.isFinite(classLimit) && classLimit > 0 && classLimit <= 1) {
    return 1;
  }

  const duration = Number(pkg?.duration_package ?? 0);

  if (!Number.isFinite(duration) || duration <= 0) {
    return 1;
  }

  if (duration <= 30) return 1;
  if (duration <= 60) return 2;
  if (duration <= 90) return 3;

  return 4;
};

export const getAvailableInstallmentOptions = (pkg = {}) => {
  const max = getMaxInstallmentsForPackage(pkg);
  return [2, 3, 4].filter((count) => count <= max);
};

export const isSepaDirectDebitMethod = (paymentMethod) => {
  const normalized = String(paymentMethod ?? '').trim().toLowerCase();
  return normalized === 'sepa_debit' || normalized === 'sepa' || normalized === 'sepa-direct-debit';
};

export const getEffectiveInstallments = ({ paymentMethod, requestedInstallments, pkg = {} }) => {
  const requested = Number(requestedInstallments ?? 0);

  if (!isSepaDirectDebitMethod(paymentMethod)) {
    return 1;
  }

  const maxAllowed = getMaxInstallmentsForPackage(pkg);
  if (!Number.isFinite(requested) || requested <= 0) {
    return 1;
  }

  return Math.min(requested, maxAllowed);
};
