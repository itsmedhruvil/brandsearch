import React from 'react';
import { LucideIcon, Database, Rocket, Search, Globe, Shield, Sparkles } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureCardProps extends Feature {
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, className }) => (
  <div className={`p-6 bg-white/5 rounded-lg ${className || ''}`}>
    <div className="mb-4 bg-blue-100 w-12 h-12 flex items-center justify-center rounded-lg">
      <Icon className="w-6 h-6 text-blue-600" />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{description}</p>
  </div>
);

const Features: React.FC = () => {
  const features: Feature[] = [
    {
      icon: Database,
      title: "Comprehensive Brand Data",
      description: "Access detailed brand information through multiple public APIs, providing rich, up-to-date data for creating comprehensive brand profiles."
    },
    {
      icon: Rocket,
      title: "Automated Page Generation",
      description: "Generate professional brand pages instantly by leveraging our intelligent data aggregation and formatting system."
    },
    {
      icon: Search,
      title: "Smart Brand Analytics",
      description: "Get valuable insights into brand presence and performance across different platforms and markets."
    },
    {
      icon: Globe,
      title: "Multi-Platform Integration",
      description: "Connect with various data sources and APIs to create a complete picture of any brand's digital footprint."
    },
    {
      icon: Shield,
      title: "Verified Information",
      description: "Access only reliable, verified brand data from trusted public sources and official company databases."
    },
    {
      icon: Sparkles,
      title: "Custom Formatting",
      description: "Customize how brand information is displayed with flexible templates and styling options."
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Brand Page Creation</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Create professional brand pages automatically using our advanced API integration system
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;