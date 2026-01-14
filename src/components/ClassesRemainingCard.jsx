import { useClasses } from "../context/ClassesContext";
import { BookOpen, DollarSign } from "lucide-react";

export const ClassesRemainingCard = () => {
  const { classesRemaining, loading } = useClasses();

  if (loading) {
    return (
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-primary)] rounded-lg p-4 animate-pulse">
        <div className="h-20 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (!classesRemaining) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-lg p-6 text-white shadow-lg border border-[var(--color-primary)]">
      <div className="grid grid-cols-2 gap-6">
        {/* Clases Restantes */}
        <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <BookOpen size={28} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white text-opacity-90">
              Clases Restantes
            </p>
            <p className="text-3xl font-bold text-white">
              {classesRemaining.remaining_classes || 0}
            </p>
          </div>
        </div>

        {/* Valor Total */}
        <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <DollarSign size={28} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white text-opacity-90">
              Valor Total
            </p>
            <p className="text-3xl font-bold text-white">
              ${classesRemaining.total_value || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Información Adicional */}
      <div className="mt-4 pt-4 border-t border-white border-opacity-20">
        <p className="text-sm text-white text-opacity-80">
          {classesRemaining.total_enrolled || 0} clases inscritas • 
          {" "}
          {classesRemaining.completed_classes || 0} completadas
        </p>
      </div>
    </div>
  );
};
