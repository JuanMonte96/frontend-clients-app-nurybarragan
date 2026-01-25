import { use, useEffect } from "react";
import { ClassesList } from "../../components/ClassesList";
import { useClasses } from "../../context/ClassesContext";
import { ClassesRemainingCard } from "../../components/ClassesRemainingCard";
import { useTranslation } from "react-i18next";

export const ClassesUser = () => {

  const { t } = useTranslation();
  const { fetchClassesRemaining } = useClasses();

  useEffect(() => {
    fetchClassesRemaining();
  }, [fetchClassesRemaining]);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text)]">{t("classes.title")}</h1>
        <div className="w-full sm:w-auto">
          <ClassesRemainingCard />
        </div>
      </div>
      <ClassesList />
    </div>
  );
}