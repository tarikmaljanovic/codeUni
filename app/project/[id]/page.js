import ProjectUI from "@/app/components/project"

export default function Project({ params }) {
    return(
        <ProjectUI id={params.id} />
    )
}