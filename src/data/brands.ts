import type { Brand } from "@/types/brand";
import { logoUrl } from "@/lib/brands/logo";
import { slugify } from "@/lib/brands/slug";

/**
 * Curated seed dataset for the directory.
 *
 * This is the "zero-config" data source: it lets the app run with no API keys.
 * In production, replace this with a database read behind the same `Brand`
 * type (see src/lib/brands/repository.ts). The enrichment providers in
 * src/lib/brands/providers can refresh individual records from the network.
 */
type SeedBrand = Omit<
  Brand,
  "id" | "slug" | "logo" | "colors" | "updatedAt" | "website"
> & {
  /** Raw brand palette; logo/slug/id/website are derived below. */
  colors: string[];
  website?: string;
};

const SEED_UPDATED_AT = "2025-01-01T00:00:00.000Z";

const SEED: SeedBrand[] = [
  {
    name: "Apple",
    domain: "apple.com",
    tagline: "Think different.",
    description:
      "Apple designs and sells consumer electronics, software and services, including the iPhone, Mac, iPad and Apple Watch.",
    category: "technology",
    industry: "Consumer Electronics",
    tags: ["hardware", "consumer-electronics", "software", "services"],
    colors: ["#000000", "#A2AAAD"],
    founded: 1976,
    headquarters: "Cupertino, California",
    country: "United States",
    employees: "160,000+",
    socials: {
      twitter: "https://twitter.com/Apple",
      youtube: "https://www.youtube.com/@Apple",
      linkedin: "https://www.linkedin.com/company/apple",
    },
    featured: true,
  },
  {
    name: "Microsoft",
    domain: "microsoft.com",
    tagline: "Empowering every person and organization on the planet.",
    description:
      "Microsoft builds productivity software, cloud infrastructure and devices, from Windows and Office to the Azure cloud platform.",
    category: "technology",
    industry: "Software & Cloud",
    tags: ["software", "cloud", "ai", "productivity"],
    colors: ["#F25022", "#7FBA00", "#00A4EF", "#FFB900"],
    founded: 1975,
    headquarters: "Redmond, Washington",
    country: "United States",
    employees: "220,000+",
    socials: {
      twitter: "https://twitter.com/Microsoft",
      linkedin: "https://www.linkedin.com/company/microsoft",
    },
  },
  {
    name: "Google",
    domain: "google.com",
    tagline: "Organize the world's information.",
    description:
      "Google operates the world's most used search engine and a broad portfolio spanning advertising, Android, cloud and AI research.",
    category: "technology",
    industry: "Internet & Search",
    tags: ["search", "advertising", "cloud", "ai", "android"],
    colors: ["#4285F4", "#EA4335", "#FBBC05", "#34A853"],
    founded: 1998,
    headquarters: "Mountain View, California",
    country: "United States",
    employees: "180,000+",
    socials: {
      twitter: "https://twitter.com/Google",
      youtube: "https://www.youtube.com/@Google",
    },
    featured: true,
  },
  {
    name: "NVIDIA",
    domain: "nvidia.com",
    tagline: "The engine of modern AI computing.",
    description:
      "NVIDIA designs GPUs and accelerated-computing platforms that power gaming, data centers and the training of large AI models.",
    category: "technology",
    industry: "Semiconductors",
    tags: ["gpu", "ai", "hardware", "data-center"],
    colors: ["#76B900"],
    founded: 1993,
    headquarters: "Santa Clara, California",
    country: "United States",
    employees: "26,000+",
    socials: {
      twitter: "https://twitter.com/nvidia",
      linkedin: "https://www.linkedin.com/company/nvidia",
    },
  },
  {
    name: "Stripe",
    domain: "stripe.com",
    tagline: "Financial infrastructure for the internet.",
    description:
      "Stripe provides APIs that let businesses accept payments, manage subscriptions and move money around the world.",
    category: "technology",
    industry: "Payments Infrastructure",
    tags: ["payments", "fintech", "api", "developer-tools"],
    colors: ["#635BFF"],
    founded: 2010,
    headquarters: "South San Francisco, California",
    country: "United States",
    socials: {
      twitter: "https://twitter.com/stripe",
      github: "https://github.com/stripe",
      linkedin: "https://www.linkedin.com/company/stripe",
    },
    featured: true,
  },
  {
    name: "Shopify",
    domain: "shopify.com",
    tagline: "Make commerce better for everyone.",
    description:
      "Shopify is a cloud commerce platform that gives merchants the tools to build and run online and in-person stores.",
    category: "technology",
    industry: "E-commerce Platform",
    tags: ["ecommerce", "saas", "retail", "payments"],
    colors: ["#95BF47", "#5E8E3E"],
    founded: 2006,
    headquarters: "Ottawa, Ontario",
    country: "Canada",
    socials: {
      twitter: "https://twitter.com/Shopify",
      github: "https://github.com/Shopify",
    },
  },
  {
    name: "Airbnb",
    domain: "airbnb.com",
    tagline: "Belong anywhere.",
    description:
      "Airbnb is a marketplace connecting travellers with unique stays and experiences hosted by people around the world.",
    category: "technology",
    industry: "Travel Marketplace",
    tags: ["travel", "marketplace", "hospitality"],
    colors: ["#FF5A5F"],
    founded: 2008,
    headquarters: "San Francisco, California",
    country: "United States",
    socials: {
      twitter: "https://twitter.com/airbnb",
      instagram: "https://www.instagram.com/airbnb",
    },
  },
  {
    name: "Netflix",
    domain: "netflix.com",
    tagline: "Unlimited films, TV programmes and more.",
    description:
      "Netflix is a streaming service offering films, series and games, and one of the largest producers of original content.",
    category: "media",
    industry: "Streaming Media",
    tags: ["streaming", "media", "entertainment", "original-content"],
    colors: ["#E50914"],
    founded: 1997,
    headquarters: "Los Gatos, California",
    country: "United States",
    socials: {
      twitter: "https://twitter.com/netflix",
      youtube: "https://www.youtube.com/@Netflix",
    },
    featured: true,
  },
  {
    name: "Spotify",
    domain: "spotify.com",
    tagline: "Music for everyone.",
    description:
      "Spotify is an audio streaming platform offering music, podcasts and audiobooks through a freemium model.",
    category: "media",
    industry: "Audio Streaming",
    tags: ["music", "streaming", "audio", "podcasts"],
    colors: ["#1DB954"],
    founded: 2006,
    headquarters: "Stockholm",
    country: "Sweden",
    socials: {
      twitter: "https://twitter.com/Spotify",
      instagram: "https://www.instagram.com/spotify",
    },
  },
  {
    name: "Adobe",
    domain: "adobe.com",
    tagline: "Changing the world through digital experiences.",
    description:
      "Adobe makes creative software including Photoshop, Illustrator and the Firefly generative AI platform.",
    category: "technology",
    industry: "Creative Software",
    tags: ["software", "creative", "design", "ai"],
    colors: ["#FF0000", "#000000"],
    founded: 1982,
    headquarters: "San Jose, California",
    country: "United States",
    socials: {
      twitter: "https://twitter.com/Adobe",
      github: "https://github.com/adobe",
    },
  },
  {
    name: "Nike",
    domain: "nike.com",
    tagline: "Just do it.",
    description:
      "Nike designs and markets athletic footwear, apparel and equipment, and is one of the most valuable sportswear brands in the world.",
    category: "fashion",
    industry: "Sportswear & Apparel",
    tags: ["sportswear", "apparel", "footwear", "athletics"],
    colors: ["#111111"],
    founded: 1964,
    headquarters: "Beaverton, Oregon",
    country: "United States",
    socials: {
      twitter: "https://twitter.com/Nike",
      instagram: "https://www.instagram.com/nike",
    },
    featured: true,
  },
  {
    name: "Adidas",
    domain: "adidas.com",
    tagline: "Impossible is nothing.",
    description:
      "Adidas is a German sportswear company producing footwear, apparel and accessories for sport and lifestyle.",
    category: "fashion",
    industry: "Sportswear & Apparel",
    tags: ["sportswear", "apparel", "footwear"],
    colors: ["#000000", "#FFFFFF"],
    founded: 1949,
    headquarters: "Herzogenaurach",
    country: "Germany",
    socials: {
      twitter: "https://twitter.com/adidas",
      instagram: "https://www.instagram.com/adidas",
    },
  },
  {
    name: "Zara",
    domain: "zara.com",
    tagline: "Affordable trend-driven fashion.",
    description:
      "Zara is a fast-fashion retailer owned by Inditex, known for bringing runway trends to stores in a matter of weeks.",
    category: "fashion",
    industry: "Fast Fashion",
    tags: ["fashion", "retail", "apparel"],
    colors: ["#000000"],
    founded: 1975,
    headquarters: "A Coruña",
    country: "Spain",
  },
  {
    name: "H&M",
    domain: "hm.com",
    tagline: "Fashion and quality at the best price.",
    description:
      "H&M is a Swedish fast-fashion retailer offering clothing and accessories for men, women, teenagers and children.",
    category: "fashion",
    industry: "Fast Fashion",
    tags: ["fashion", "retail", "apparel"],
    colors: ["#E50010"],
    founded: 1947,
    headquarters: "Stockholm",
    country: "Sweden",
  },
  {
    name: "Coca-Cola",
    domain: "coca-cola.com",
    tagline: "Taste the feeling.",
    description:
      "The Coca-Cola Company is the world's largest non-alcoholic beverage company, with a portfolio of more than 500 brands.",
    category: "food-beverage",
    industry: "Beverages",
    tags: ["beverages", "soft-drinks", "consumer-goods"],
    colors: ["#F40009"],
    founded: 1892,
    headquarters: "Atlanta, Georgia",
    country: "United States",
    socials: {
      twitter: "https://twitter.com/CocaCola",
      instagram: "https://www.instagram.com/cocacola",
    },
    featured: true,
  },
  {
    name: "Starbucks",
    domain: "starbucks.com",
    tagline: "To inspire and nurture the human spirit.",
    description:
      "Starbucks is a global coffeehouse chain roasting and retailing specialty coffee, drinks and food across tens of thousands of stores.",
    category: "food-beverage",
    industry: "Coffee & Retail",
    tags: ["coffee", "retail", "beverages", "hospitality"],
    colors: ["#00704A"],
    founded: 1971,
    headquarters: "Seattle, Washington",
    country: "United States",
    socials: {
      twitter: "https://twitter.com/Starbucks",
      instagram: "https://www.instagram.com/starbucks",
    },
  },
  {
    name: "McDonald's",
    domain: "mcdonalds.com",
    tagline: "I'm lovin' it.",
    description:
      "McDonald's is one of the world's largest quick-service restaurant chains, serving burgers, fries and breakfast in over 100 countries.",
    category: "food-beverage",
    industry: "Quick Service Restaurants",
    tags: ["fast-food", "restaurants", "consumer-goods"],
    colors: ["#FFC72C", "#DA291C"],
    founded: 1940,
    headquarters: "Chicago, Illinois",
    country: "United States",
  },
  {
    name: "Tesla",
    domain: "tesla.com",
    tagline: "Accelerate the world's transition to sustainable energy.",
    description:
      "Tesla designs and manufactures electric vehicles, battery energy storage and solar products.",
    category: "automotive",
    industry: "Electric Vehicles",
    tags: ["ev", "automotive", "energy", "batteries"],
    colors: ["#CC0000"],
    founded: 2003,
    headquarters: "Austin, Texas",
    country: "United States",
    socials: {
      twitter: "https://twitter.com/Tesla",
      youtube: "https://www.youtube.com/@Tesla",
    },
    featured: true,
  },
  {
    name: "BMW",
    domain: "bmw.com",
    tagline: "The ultimate driving machine.",
    description:
      "BMW is a German manufacturer of premium automobiles and motorcycles, including the BMW, MINI and Rolls-Royce brands.",
    category: "automotive",
    industry: "Automotive",
    tags: ["automotive", "luxury", "ev", "motorcycles"],
    colors: ["#1C69D4", "#000000"],
    founded: 1916,
    headquarters: "Munich",
    country: "Germany",
  },
  {
    name: "Visa",
    domain: "visa.com",
    tagline: "Everywhere you want to be.",
    description:
      "Visa operates one of the world's largest payments networks, connecting consumers, merchants and financial institutions.",
    category: "finance",
    industry: "Payments Network",
    tags: ["payments", "finance", "cards"],
    colors: ["#1A1F71"],
    founded: 1958,
    headquarters: "San Francisco, California",
    country: "United States",
  },
  {
    name: "Mastercard",
    domain: "mastercard.com",
    tagline: "Start something priceless.",
    description:
      "Mastercard is a global payments technology company processing transactions across its card network.",
    category: "finance",
    industry: "Payments Network",
    tags: ["payments", "finance", "cards"],
    colors: ["#EB001B", "#F79E1B"],
    founded: 1966,
    headquarters: "Purchase, New York",
    country: "United States",
  },
  {
    name: "PayPal",
    domain: "paypal.com",
    tagline: "The safer, easier way to pay.",
    description:
      "PayPal provides digital wallets and online payment services for consumers and merchants around the world.",
    category: "finance",
    industry: "Digital Payments",
    tags: ["payments", "fintech", "digital-wallet"],
    colors: ["#003087", "#009CDE"],
    founded: 1998,
    headquarters: "San Jose, California",
    country: "United States",
  },
  {
    name: "Amazon",
    domain: "amazon.com",
    tagline: "Work hard. Have fun. Make history.",
    description:
      "Amazon operates the world's largest online marketplace alongside AWS, the leading cloud computing platform.",
    category: "retail",
    industry: "E-commerce & Cloud",
    tags: ["ecommerce", "cloud", "logistics", "retail"],
    colors: ["#FF9900", "#232F3E"],
    founded: 1994,
    headquarters: "Seattle, Washington",
    country: "United States",
    featured: true,
  },
  {
    name: "Walmart",
    domain: "walmart.com",
    tagline: "Save money. Live better.",
    description:
      "Walmart is the world's largest retailer by revenue, operating hypermarkets, supermarkets and a growing e-commerce business.",
    category: "retail",
    industry: "Retail",
    tags: ["retail", "grocery", "ecommerce"],
    colors: ["#0071CE", "#FFC220"],
    founded: 1962,
    headquarters: "Bentonville, Arkansas",
    country: "United States",
  },
  {
    name: "IKEA",
    domain: "ikea.com",
    tagline: "Affordable, well-designed home furnishing.",
    description:
      "IKEA is a Swedish home-furnishings retailer famous for flat-pack furniture and its self-assembly showroom experience.",
    category: "retail",
    industry: "Home Furnishings",
    tags: ["furniture", "home", "retail"],
    colors: ["#0058A3", "#FFDA1A"],
    founded: 1943,
    headquarters: "Leiden",
    country: "Netherlands",
  },
  {
    name: "Target",
    domain: "target.com",
    tagline: "Expect more. Pay less.",
    description:
      "Target is a US general-merchandise retailer known for its private-label brands and 'cheap chic' design partnerships.",
    category: "retail",
    industry: "Retail",
    tags: ["retail", "grocery", "ecommerce"],
    colors: ["#CC0000"],
    founded: 1902,
    headquarters: "Minneapolis, Minnesota",
    country: "United States",
  },
  {
    name: "Disney",
    domain: "disney.com",
    tagline: "The place where dreams come true.",
    description:
      "The Walt Disney Company operates film studios, theme parks, television networks and the Disney+ streaming service.",
    category: "media",
    industry: "Media & Entertainment",
    tags: ["media", "entertainment", "streaming", "parks"],
    colors: ["#113CCF"],
    founded: 1923,
    headquarters: "Burbank, California",
    country: "United States",
    featured: true,
  },
  {
    name: "Sony",
    domain: "sony.com",
    tagline: "Be moved.",
    description:
      "Sony spans consumer electronics, the PlayStation gaming platform, image sensors and music and film entertainment.",
    category: "media",
    industry: "Electronics & Entertainment",
    tags: ["electronics", "gaming", "entertainment", "image-sensors"],
    colors: ["#000000"],
    founded: 1946,
    headquarters: "Tokyo",
    country: "Japan",
  },
  {
    name: "Louis Vuitton",
    domain: "louisvuitton.com",
    tagline: "The art of travel.",
    description:
      "Louis Vuitton is a French luxury house founded on leather goods and known today for ready-to-wear, accessories and travel.",
    category: "luxury",
    industry: "Luxury Fashion",
    tags: ["luxury", "fashion", "leather-goods"],
    colors: ["#6B4A2E", "#000000"],
    founded: 1854,
    headquarters: "Paris",
    country: "France",
    featured: true,
  },
  {
    name: "Rolex",
    domain: "rolex.com",
    tagline: "A crown for every achievement.",
    description:
      "Rolex is a Swiss luxury watchmaker renowned for precision timepieces and its pioneering of the wristwatch chronometer.",
    category: "luxury",
    industry: "Luxury Watches",
    tags: ["luxury", "watches", "horology"],
    colors: ["#006039", "#A37E2C"],
    founded: 1905,
    headquarters: "Geneva",
    country: "Switzerland",
  },
  {
    name: "Chanel",
    domain: "chanel.com",
    tagline: "Fashion fades, only style remains.",
    description:
      "Chanel is a French luxury fashion house producing haute couture, ready-to-wear, accessories, fragrance and beauty.",
    category: "luxury",
    industry: "Luxury Fashion & Beauty",
    tags: ["luxury", "fashion", "beauty", "fragrance"],
    colors: ["#000000"],
    founded: 1910,
    headquarters: "Paris",
    country: "France",
  },
];

/**
 * Materialise the seed into fully-formed `Brand` records: derive a unique slug
 * and id from the name, resolve the logo URL and normalise colours.
 */
const slugSeen = new Map<string, number>();

export const brands: Brand[] = SEED.map((seed) => {
  const base = slugify(seed.name);
  const count = slugSeen.get(base) ?? 0;
  slugSeen.set(base, count + 1);
  const slug = count === 0 ? base : `${base}-${count + 1}`;

  return {
    ...seed,
    id: slug,
    slug,
    website: seed.website ?? `https://${seed.domain}`,
    logo: logoUrl(seed.domain),
    colors: seed.colors.map((hex) => ({ hex, source: "seed" })),
    updatedAt: SEED_UPDATED_AT,
  };
});

export const brandCount = brands.length;
