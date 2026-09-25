import Image from "next/image";

export function ProjectGridCard({ project, className = "", sizes, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`View ${project.title} gallery`}
      className={`group relative block overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      <Image
        src={project.afterImage}
        alt=""
        fill
        sizes={sizes ?? "(min-width: 640px) 50vw, 100vw"}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
    </button>
  );
}
