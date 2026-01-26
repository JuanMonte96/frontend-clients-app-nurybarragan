import api from "./api.js";

export const sendContactMessage = async (formData) => {
    const { data } = await api.post("/api/contactUs/contact", formData);
    console.log(data);
    return data;
}