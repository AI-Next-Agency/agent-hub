import { Briefcase, GraduationCap, Users, BookOpen, Search, HeartHandshake } from "lucide-react";

const services = [
  {
    icon: Briefcase,
    name: "Executive AI Workshops",
    description:
      "Strategic sessions for leaders who need clarity, direction, and sensible adoption priorities.",
  },
  {
    icon: Users,
    name: "Team Training by Function",
    description:
      "Practical learning for finance, marketing, sales, operations, HR, and engineering teams.",
  },
  {
    icon: GraduationCap,
    name: "Hands-On Courses",
    description:
      "Guided learning that turns AI concepts into real workflow improvements.",
  },
  {
    icon: BookOpen,
    name: "AI Adoption Playbooks",
    description:
      "Simple frameworks and standards that help teams use AI with more consistency.",
  },
  {
    icon: Search,
    name: "Use-Case Discovery Sessions",
    description:
      "Find the most valuable AI opportunities inside the work your teams already do.",
  },
  {
    icon: HeartHandshake,
    name: "Ongoing Enablement",
    description:
      "Follow-up support, office hours, and reinforcement that help learning turn into team habits.",
  },
];

export function ServicesSection() {
  return (
    <section
      className="px-6 py-6"
      id="services"
      style={{ scrollMarginTop: 80 }}
    >
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div
            key={service.name}
            className="elegant-card flex flex-col justify-between p-7"
          >
            <div>
              <service.icon size={22} strokeWidth={1.5} className="text-text-muted" />
              <h3 className="mt-6 text-base font-medium text-text">
                {service.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {service.description}
              </p>
            </div>
            <p className="mt-8 text-sm text-text-muted">
              {String(index + 1).padStart(2, "0")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
