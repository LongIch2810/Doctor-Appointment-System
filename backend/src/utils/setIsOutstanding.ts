import { thresholdOustanding } from "./constants";
export const setIsOutstanding=(doctor:any)=>{
    const finalScore = calculateFinalScore(doctor.avg_rating,doctor.appointments_completed,doctor.total_appointments)
    return finalScore>=thresholdOustanding
}

export const calculateFinalScore=(avg_rating:number,appointments_completed:number,totalAppointments:number) => {
    const finalScore =
    0.7 * avg_rating +
    0.3 * (Math.log(1 + appointments_completed) / Math.log(1 + totalAppointments));
    return finalScore
}

export const setIsOutstandingDoctors=(doctors:any)=>{
    return doctors.map((doctor:any) => {
        return {...doctor,isOutstanding:setIsOutstanding(doctor)}
    })
}