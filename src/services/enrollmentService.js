import api from "./api.js";

export const enrollClass = async (id_schedule) =>{
    const { data } = await api.post(`/api/enrollments/enroll`, {id_schedule}); 
    console
}