import { useClasses } from "../context/ClassesContext";
import { useTranslation } from "react-i18next";

export const ClassesRemainingCard = () => {
  const { classesRemaining, loading } = useClasses();
  const { t } = useTranslation(); 

  if (loading) {
    return (
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-primary)] rounded-lg p-3 sm:p-4 animate-pulse">
        <div className="h-16 sm:h-20 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (!classesRemaining) {
    return (
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-primary)] rounded-lg p-3 sm:p-4">
        <h3 className="text-xs sm:text-sm text-[var(--color-text)]">{t("classes.noClasses")}</h3>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-lg p-3 sm:p-4 text-[var(--color-text)] shadow-lg border border-[var(--color-primary)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        {/* Clases Restantes */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-full">
            <p className="text-xs sm:text-sm font-semibold text-[var(--color-text)] text-opacity-90 truncate">
              {t("classes.classesRemaining")}
            </p>
            <p className="text-lg sm:text-xl font-bold text-[var(--color-text)]">
              {classesRemaining.classesRemaining || 0}
            </p>
          </div>
        </div>

        {/* Valor Total */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-full">
            <p className="text-xs sm:text-sm font-semibold text-[var(--color-text)] text-opacity-90 truncate">
              {t("classes.totalClasses")}
            </p>
            <p className="text-lg sm:text-xl font-bold text-[var(--color-text)]">
              {classesRemaining.totalClassLimit || 0}
            </p>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="pl-2 sm:pl-3 border-l border-white border-opacity-20 flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-[var(--color-text)] text-opacity-80 truncate">
            {classesRemaining.classesUsed || 0} {t("classes.totalEnrolled")}
          </p>
        </div>
      </div>
    </div>
  );
};
