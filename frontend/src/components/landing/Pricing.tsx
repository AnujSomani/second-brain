import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { SectionHeader } from "./SectionHeader";
import { CheckIcon } from "../../icons";

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Up to 500 links",
        "Basic AI search",
        "Web access",
        "Standard support"
      ],
      cta: "Get Started",
      variant: "secondary" as const,
      popular: false,
      disabled: false
    },
    {
      name: "Pro",
      price: "$20",
      period: "month",
      description: "For power users",
      features: [
        "Unlimited links",
        "Advanced AI search",
        "Share Brain feature",
        "Priority support",
        "Knowledge graph visualization",
        "Advanced analytics"
      ],
      cta: "Coming Soon",
      variant: "primary" as const,
      popular: true,
      disabled: true
    }
  ];

  return (
    <section id="pricing" className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-transparent">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="Simple, transparent pricing"
          subtitle="Choose the plan that's right for you"
        />

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-3xl border-2 transition-all duration-300 ${
                plan.popular
                  ? "border-purple-500 bg-panel shadow-xl shadow-purple-500/20 md:scale-105"
                  : "border-line bg-panel/90 hover:border-purple-300 dark:hover:border-purple-400/60 shadow-[0_10px_30px_rgba(147,51,234,0.04)] dark:shadow-purple-950/20"
              } ${plan.disabled ? "opacity-80" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-ink mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-ink">{plan.price}</span>
                  <span className="text-muted">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <CheckIcon className="size-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-ink/90">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.disabled ? (
                <Button variant={plan.variant} title={plan.cta} fullWidth disabled />
              ) : (
                <Link to="/signup" className="block">
                  <Button variant={plan.variant} title={plan.cta} fullWidth />
                </Link>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-muted text-sm mt-8">
          Free plan available now. Pro features coming soon.
        </p>
      </div>
    </section>
  );
}
