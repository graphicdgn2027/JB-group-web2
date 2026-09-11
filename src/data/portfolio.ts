import { Car, Zap, Briefcase, Building2 } from "lucide-react";

export const PORTFOLIO_DATA: Record<string, any> = {
  "reliance-trade-international": {
    id: "reliance-trade-international",
    title: "Reliance Trade International",
    icon: Zap,
    img: "/assets/reliance-gallery/cover-image.png",
    description: "Lubricants & Energy Storage Solutions. The foundation of our journey, serving automotive, industrial and aviation lubricant markets.",
    overview: "Reliance Trade International Pvt. Ltd. is the foundation of JB Group's business journey. Established in 1982, the company built reputation through the import, marketing and distribution of quality products in Nepal. Over the decades, Reliance Trade International developed deep experience in the lubricant market, serving automotive, commercial, industrial and specialized applications. Its lubricant portfolio includes internationally recognized brands such as Mobil and IPOL, as well as trusted battery brands. Building on its distribution capabilities and understanding of evolving energy requirements, the company has expanded into modern energy-storage and power-backup solutions. Our focus remains consistent: authentic products, dependable availability, strong market relationships and responsive customer service.",
    details: [
      "Automotive & Commercial vehicle lubricants",
      "Industrial & Aviation lubricants",
      "Lubrication-related products and solutions",
      "Lithium batteries & Inverters",
      "Power-backup solutions"
    ],
    stats: [
      { label: "Established", value: "1982" },
      { label: "Lubricants", value: "Mobil & IPOL" },
      { label: "Batteries", value: "Volta & Eastman" }
    ],
    features: [
      {
        title: "Mobil Lubricants",
        description: "World-class synthetic and conventional engine oils for automotive and industrial applications. Ensuring peak performance and protection.",
        image: "/assets/reliance-gallery/mobil.png"
      },
      {
        title: "IPOL Lubricants",
        description: "High-quality lubricants designed for diverse industrial and automotive needs, offering reliability and efficiency.",
        image: "/assets/reliance-gallery/ipol.jpg"
      },
      {
        title: "Eastman Batteries",
        description: "Advanced battery technology providing robust power backup for commercial and residential applications.",
        image: "/assets/reliance-gallery/eastman.jpg"
      },
      {
        title: "Volta Batteries",
        description: "Dependable energy storage solutions for automotive and backup power, built to last in demanding conditions.",
        image: "/assets/reliance-gallery/volta.jpg"
      }
    ],
    brands: [
      { name: "Mobil", logo: "/assets/reliance-gallery/mobil.png" },
      { name: "IPOL", logo: "/assets/reliance-gallery/ipol.jpg" },
      { name: "Volta", logo: "/assets/reliance-gallery/volta.jpg" },
      { name: "Eastman", logo: "/assets/reliance-gallery/eastman.jpg" }
    ],
    gallery: [
      "/assets/reliance-gallery/cover-image.png",
      "/assets/reliance-gallery/mobil.png",
      "/assets/reliance-gallery/eastman.jpg",
      "/assets/reliance-gallery/volta.jpg",
      "/assets/reliance-gallery/ipol.jpg"
    ]
  },
  "kabsons-industries": {
    id: "kabsons-industries",
    title: "Kabsons Industries",
    icon: Zap,
    img: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=1600&q=80",
    description: "LPG Bottling. Strengthening the Group's presence in Nepal's essential energy sector.",
    overview: "Kabsons Industries Pvt. Ltd. represents JB Group's presence in Nepal's LPG sector and marks an important step in the Group's diversification into essential energy businesses. The company operates an LPG bottling facility in Dhading and supports the supply of LPG to the Nepalese market through disciplined operations, safety-focused processes and dependable service. Kabsons reflects JB Group's approach to diversification: identify a meaningful opportunity, invest strategically, strengthen operations and build long-term value.",
    details: [
      "LPG bottling",
      "Operational safety and reliability",
      "Efficient plant operations",
      "Dependable market service",
      "Long-term participation in Nepal's energy ecosystem"
    ],
    stats: [
      { label: "Sector", value: "Energy" },
      { label: "Facility", value: "Dhading" },
      { label: "Operation", value: "Bottling" }
    ],
    brands: [
      { name: "Shreemaya Gas", logo: "/assets/shreemaya.png", fallbackText: "Shreemaya Gas" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80",
      "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80"
    ]
  },
  "hipco-trading": {
    id: "hipco-trading",
    title: "HIPCO Trading",
    icon: Car,
    logo: "/assets/hipco-logo.png",
    img: "https://images.unsplash.com/photo-1588011930968-eadac80e6a5a?w=1600&q=80",
    description: "Electric Mobility. Representing Montra electric three-wheelers in Nepal.",
    overview: "HIPCO Trading Pvt. Ltd. represents JB Group's growing commitment to the future of mobility in Nepal. The company represents Montra Electric Vehicles in Nepal in the electric three-wheeler segment and is developing capabilities across sales, distribution, dealer development, customer support and after-sales service. As electric mobility continues to evolve, HIPCO is expanding its presence beyond a single product category with the objective of building a broader and sustainable e-mobility platform for Nepal.",
    details: [
      "Montra electric three-wheelers",
      "Electric vehicle sales and distribution",
      "Dealer network development",
      "Customer and fleet engagement",
      "After-sales and service support",
      "Vehicle financing partnerships"
    ],
    stats: [
      { label: "EV Brand", value: "Montra" },
      { label: "Focus", value: "Clean Tech" },
      { label: "Support", value: "After-sales" }
    ],
    brands: [
      { name: "Montra", logo: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&q=80", fallbackText: "Montra Electric" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&q=80",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80",
      "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=800&q=80"
    ]
  },
  "jb-group-investments": {
    id: "jb-group-investments",
    title: "JB Group Investments",
    icon: Briefcase,
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80",
    description: "Investing in the Future. Strategic investments in technology, financial sectors and emerging opportunities.",
    overview: "JB Group actively evaluates strategic investment opportunities that can create long-term value and complement the Group's existing businesses. Our investment approach is focused on sectors shaped by technology, changing consumer behavior and Nepal's evolving economic landscape. We seek opportunities where capital can be combined with market understanding, partnerships and disciplined execution to create sustainable long-term value.",
    details: [
      "Future technology companies",
      "Digital and technology-enabled businesses",
      "Strategic investments in the financial sector",
      "Emerging business models",
      "Mobility and energy-related opportunities",
      "Long-term strategic equity investments"
    ],
    stats: [
      { label: "Approach", value: "Strategic" },
      { label: "Focus", value: "Long-term" },
      { label: "Capital", value: "Disciplined" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"
    ]
  },
  "bnj-properties": {
    id: "bnj-properties",
    title: "BNJ Properties",
    icon: Building2,
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80",
    description: "Commercial Real Estate & Warehousing. Developing practical and strategically located facilities.",
    overview: "BNJ Properties represents JB Group's interests in commercial real estate and property-based business infrastructure. The business develops and manages commercial spaces and warehouse assets designed to serve companies seeking practical, well-managed and strategically located facilities. Our objective is to create and manage business spaces that support the operational needs of modern enterprises while generating sustainable long-term asset value.",
    details: [
      "Commercial business centres",
      "Office and commercial space leasing",
      "Warehouse leasing",
      "Commercial property management",
      "Future commercial property development"
    ],
    stats: [
      { label: "Sector", value: "Real Estate" },
      { label: "Focus", value: "Commercial" },
      { label: "Assets", value: "Warehousing" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
    ]
  }
};
