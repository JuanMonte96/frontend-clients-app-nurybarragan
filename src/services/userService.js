import api from './api.js'

// Actualiza los datos del perfil del usuario
export const updatedProfile = async (id_user, profileData) => {
    const { data } = await api.put(`/api/users/editProfile/${id_user}`, profileData);
    console.log(`edit user: ${data}`);
    return data;
};

// Sube un certificado (archivo) al servidor
// Acepta: pdf, png, jpeg, jpg
export const uploadCertificate = async(id_user, file) => {
    // Crear FormData para enviar el archivo
    const formData = new FormData();
    
    // Agregar el archivo con la clave que espera el backend: "certificate"
    formData.append('certificate', file);
    
    // Enviar mediante POST con multipart/form-data
    const { data } = await api.patch(
        `/api/users/upload-certificated`, 
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );
    
    console.log(`Certificate uploaded: ${data}`);
    return data;
};

// Actualiza perfil + sube certificado en una llamada
export const updateProfileWithCertificate = async(id_user, profileData, file) => {
    // Si hay archivo, agregarlo al formData
    if (file) {
        profileData.append('certificate', file);
        
        // Enviar como FormData
        const { data } = await api.put(
            `/api/editProfile/${id_user}`,
            profileData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return data;
    } else {
        // Si no hay archivo, enviar datos normales
        return updatedProfile(id_user, profileData);
    }
};

