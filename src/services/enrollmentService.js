import api from "./api.js";

export const enrollClass = async (id_schedule) => {
    const { data } = await api.post(`/api/enrollments/enroll`, { scheduleId:id_schedule });
    console.log(`Enrollment response: ${data}`);
    return data;
};

export const updateStateEnrollment = async (id_enrrolment, newStatus) => {
    const { data } = await api.patch(`/api/enrollments/change-status/${id_enrrolment}`, { newStatus })
    console.log(`Update Enrollment State response: ${data}`)
    return data;
}

export const getAllEnrollmentsByUser = async () => {
    const {data} = await api.get(`/api/enrollments/enrollsById`);
    console.log(`Get All Enrollments By User response: ${data}`);
    return data; 
}   
