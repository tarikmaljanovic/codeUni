import CourseUI from "@/app/components/course"

export default function Course({ params }) {
    return(
        <CourseUI id={params.id} />
    )
}