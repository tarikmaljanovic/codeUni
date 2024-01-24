import LessonUI from "@/app/components/lesson"

export default function Lesson({ params }) {
    return(
        <LessonUI id={params.id} />
    )
}