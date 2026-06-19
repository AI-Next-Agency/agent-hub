import { ClipboardList, Pencil, Presentation, Repeat } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Assess Team Needs",
    description:
      "We start by understanding the audience, current AI familiarity, team workflows, and the practical outcomes the company wants from training.",
  },
  {
    icon: Pencil,
    title: "Design the Learning Program",
    description:
      "We shape the workshop, training, or course around the people in the room, the work they actually do, and the level of depth they need.",
  },
  {
    icon: Presentation,
    title: "Deliver Workshops & Training",
    description:
      "Sessions combine clear frameworks, practical examples, and hands-on exercises so teams can immediately apply what they learn.",
  },
  {
    icon: Repeat,
    title: "Support Adoption",
    description:
      "After training, we help teams turn the learning into repeatable habits with guidance, follow-up, and next-step recommendations.",
  },
];

export function ProcessSection() {
  return (
    <section
      className="px-6 py-6"
      id="process"
      style={{ scrollMarginTop: 80 }}
    >
      <div className="elegant-container mx-auto max-w-6xl p-8 md:p-12 lg:p-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-normal tracking-tight text-text md:text-4xl">
              Built with{" "}
              <span className="font-display-italic text-accent">ultimate care.</span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary">
              Every program we design is thoughtfully crafted around the team,
              their workflows, and the outcomes that matter. We treat clarity,
              practice, and adoption as first-class priorities.
            </p>
            <ul className="mt-6 space-y-3">
              {steps.map((step) => (
                <li
                  key={step.title}
                  className="flex items-start gap-3 text-sm text-text-secondary"
                >
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
                  {step.description}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-border bg-surface-alt p-6">
            <div className="mb-4 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-text-muted/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-text-muted/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-text-muted/40" />
            </div>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  <span className="mt-0.5 shrink-0 font-mono text-xs text-text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-text">{step.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-text-muted">
                      {step.description.split(".")[0]}.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
