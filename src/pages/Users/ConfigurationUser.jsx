import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { updatedProfile, uploadCertificate } from "../../services/userService";
import { Upload, Save, AlertCircle, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ConfigurationUser = () => {

    const { t } = useTranslation();
    const { profile, authLoading, refreshProfile, id_user } = useAuth();
    const [formData, setFormData] = useState({
        name_user: "",
        email_user: "",
        phone: ""
    });

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Inicializa el formulario con los datos del usuario
    // Se ejecuta cuando el profile está listo
    useEffect(() => {
        if (!authLoading && profile) {
            setFormData({
                name_user: profile?.user?.name_user || "",
                email_user: profile?.user?.email_user || "",
                phone: profile?.user?.telephone_user || profile?.user?.phone || ""
            });
        }
    }, [profile, authLoading]);

    // Maneja cambios en los inputs de texto
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Maneja la selección de archivo
    // Valida que sea uno de los tipos permitidos
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            // Extensiones permitidas
            const allowedExtensions = ['pdf', 'png', 'jpeg', 'jpg'];
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

            if (!allowedExtensions.includes(fileExtension)) {
                setError("Solo se permiten archivos: PDF, PNG, JPEG, JPG");
                setFile(null);
                setFileName(null);
                return;
            }

            // Validar tamaño (máximo 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (selectedFile.size > maxSize) {
                setError("El archivo no puede ser mayor a 5MB");
                setFile(null);
                setFileName(null);
                return;
            }

            setFile(selectedFile);
            setFileName(selectedFile.name);
            setError(null);
        }
    };

    // Maneja la actualización del perfil
    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (!id_user) {
            setError("Error: No se encontró el ID del usuario");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Actualizar datos del perfil
            const response = await updatedProfile(id_user, formData);
            setSuccess("Perfil actualizado correctamente");

            // Refrescar el perfil para obtener los datos actualizados
            await refreshProfile(id_user);

            console.log("Profile updated:", response);
        } catch (err) {
            setError(`Error al actualizar perfil: ${err.response?.data?.message || err.message}`);
            console.error("Error updating profile:", err);
        } finally {
            setLoading(false);
        }
    };

    // Maneja la carga del certificado
    const handleUploadCertificate = async (e) => {
        e.preventDefault();

        if (!file) {
            setError("Por favor selecciona un archivo");
            return;
        }

        if (!id_user) {
            setError("Error: No se encontró el ID del usuario");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await uploadCertificate(id_user, file);
            setSuccess("Certificado cargado correctamente");
            setFile(null);
            setFileName(null);

            // Limpiar el input del archivo
            document.getElementById("certificateInput").value = "";

            console.log("Certificate uploaded:", response);
        } catch (err) {
            setError(`Error al cargar certificado: ${err.response?.data?.message || err.message}`);
            console.error("Error uploading certificate:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg)] p-3 sm:p-4 md:p-6">
            <div className="max-w-2xl mx-auto w-full">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4 sm:mb-6 md:mb-8">{t("configuration.title")}</h1>

                {/* Si el perfil aún está cargando */}
                {authLoading && (
                    <div className="flex items-center justify-center py-8 sm:py-12">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 sm:h-12 w-8 sm:w-12 border-b-2 border-[var(--color-primary)]"></div>
                            <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-[var(--color-text)]">{t("configuration.loadingProfile")}</p>
                        </div>
                    </div>
                )}

                {!authLoading && !profile && (
                    <div className="mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3 bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                        <p>{t("configuration.errorloading")}</p>
                    </div>
                )}
                {error && (
                    <div className="mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3 bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3 bg-green-100 border border-green-400 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
                        <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                        <p>{success}</p>
                    </div>
                )}

                {/* SECCIÓN 1: EDITAR DATOS DE PERFIL */}
                {!authLoading && profile && (
                    <div className="bg-[var(--color-bg-secondary)] rounded-lg sm:rounded-xl border border-[var(--color-primary)] p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-text)] mb-4 sm:mb-5 md:mb-6">{t("configuration.personalData")}</h2>

                        <form onSubmit={handleUpdateProfile} className="space-y-3 sm:space-y-4 md:space-y-5">
                            {/* Campo: Nombre */}
                            <div>
                                <label htmlFor="name_user" className="block text-xs sm:text-sm font-semibold text-[var(--color-text)] mb-2">
                                    {t("configuration.fullName")}
                                </label>
                                <input
                                    id="name_user"
                                    type="text"
                                    name="name_user"
                                    value={formData.name_user}
                                    onChange={handleInputChange}
                                    placeholder={formData.name_user || "Tu nombre completo"}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-[var(--color-primary)] rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-text)] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                            </div>

                            {/* Campo: Email */}
                            <div>
                                <label htmlFor="email_user" className="block text-xs sm:text-sm font-semibold text-[var(--color-text)] mb-2">
                                    {t("configuration.email")}
                                </label>
                                <input
                                    id="email_user"
                                    type="email"
                                    name="email_user"
                                    value={formData.email_user}
                                    onChange={handleInputChange}
                                    placeholder={formData.email_user || "example@example.com"}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-[var(--color-primary)] rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-text)] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                            </div>

                            {/* Campo: Teléfono */}
                            <div>
                                <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-[var(--color-text)] mb-2">
                                    {t("configuration.phone")}
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder={formData.phone || "+57 123 456 7890"}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-[var(--color-primary)] rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-text)] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                            </div>

                            {/* Botón Guardar */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={16} className="sm:size-5" />
                                {loading ? t("configuration.loading") : t("configuration.saveChanges")}
                            </button>
                        </form>
                    </div>
                )}

                {/* SECCIÓN 2: CARGAR CERTIFICADO */}
                {!authLoading && profile && (
                    <div className="bg-[var(--color-bg-secondary)] rounded-lg sm:rounded-xl border border-[var(--color-primary)] p-4 sm:p-6 md:p-8">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-text)] mb-4 sm:mb-5 md:mb-6">{t("configuration.certificate")}</h2>

                        <form onSubmit={handleUploadCertificate} className="space-y-3 sm:space-y-4 md:space-y-5">
                            {/* Información sobre formatos */}
                            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
                                <p className="font-semibold mb-1">{t("configuration.allowedFormats")}:</p>
                                <p>PDF, PNG, JPEG, JPG ({t("configuration.maxSize")} 5MB)</p>
                            </div>

                            {/* Selector de archivo */}
                            <div>
                                <label htmlFor="certificateInput" className="block text-xs sm:text-sm font-semibold text-[var(--color-text)] mb-2">
                                    {t("configuration.selectedFile")}
                                </label>
                                <div className="relative">
                                    <input
                                        id="certificateInput"
                                        type="file"
                                        accept=".pdf,.png,.jpeg,.jpg"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="certificateInput" className="flex items-center justify-center w-full px-3 sm:px-4 py-3 sm:py-4 bg-[var(--color-bg)] border-2 border-dashed border-[var(--color-primary)] rounded-lg cursor-pointer hover:bg-[var(--color-primary-hover)] hover:bg-opacity-10 transition">
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload size={20} className="sm:size-6 text-[var(--color-text)]" />
                                            <span className="text-xs sm:text-sm text-[var(--color-text)] font-semibold text-center px-2">
                                                {fileName ? `${t("configuration.selectedFile")}: ${fileName}` : t("configuration.clickToSelect")}
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Mostrar archivo seleccionado */}
                            {file && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
                                    <p className="font-semibold">{t("configuration.selectedFile")}:</p>
                                    <p className="break-words">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                                </div>
                            )}

                            {/* Botón Cargar */}
                            <button
                                type="submit"
                                disabled={loading || !file}
                                className="w-full py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Upload size={16} className="sm:size-5" />
                                {loading ? t("common.loading") : t("configuration.uploadCertificate")}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfigurationUser;
