import { useTranslation } from "react-i18next";
import hoverImg from "../assets/nurybarragan6.jpg";
import danceImg from "../assets/nurybarragan64.jpg";
import { useState } from "react";

export default function TeacherProfile() {
    const { t } = useTranslation();

    const [isHovering, setIsHovering] = useState(false);

    return (
        <section id="about" className="bg-[var(--color-bg-secondary)] scroll-mt-24 py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-24">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                <div className="w-full lg:w-1/2 space-y-3 sm:space-y-4 md:space-y-5">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--color-text)]">
                        {t("teachers.title")}
                    </h2>
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[var(--color-text)]">
                        {t("teachers.profesional")}: NURY BARRAGAN
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-[var(--color-text)] leading-relaxed">
                        {t("teachers.experience")}
                    </p>
                </div>
                <div className="w-full lg:w-1/2">
                    <img
                        src={isHovering ? hoverImg: danceImg}
                        alt="Nury Barragan"
                        onMouseEnter={()=> setIsHovering(true)}
                        onMouseLeave={()=> setIsHovering(false)}
                        className="rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg object-cover w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]"
                    />
                </div>
            </div>
        </section>
    );
}