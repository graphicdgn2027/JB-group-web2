import type { SiteContent } from "./types";

/**
 * The live site content as it shipped before the dashboard existed.
 *
 * This is the single source of truth whenever Supabase is unreachable, not yet
 * configured, or missing a section row — so the public site always renders even
 * with no database. It is also what "Reset to default" in the dashboard writes
 * back, and what seeds a brand-new Supabase project on first publish.
 */
export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    slideDurationMs: 6500,
    slides: [
      {
        id: "group",
        image: "/assets/hero-image/kabsonnew.png",
        eyebrow: "Since 1982",
        label: "JB Group",
        titleTop: "Four Decades of Enterprise.",
        titleBottom: "One Vision for the Future.",
        description:
          "JB Group is a diversified business group built on more than four decades of entrepreneurship, market knowledge and trusted relationships in Nepal.",
        ctaLabel: "Learn More",
        ctaHref: "/about",
      },
      {
        id: "kabsons",
        image: "/assets/hero-image/kabsonnew.png",
        eyebrow: "Manufacturing",
        label: "Kabsons Industries",
        titleTop: "Engineered for Scale.",
        titleBottom: "Built to Last.",
        description:
          "Industrial manufacturing and LPG bottling capacity that powers homes and businesses across the country, with uncompromising safety standards.",
        ctaLabel: "Our Businesses",
        ctaHref: "/businesses",
      },
      {
        id: "hipco",
        image: "/assets/hero-image/hipco-trading.png",
        eyebrow: "Trading & Distribution",
        label: "Hipco Trading",
        titleTop: "Global Brands.",
        titleBottom: "Local Expertise.",
        description:
          "A trusted distribution network connecting world-class products to markets across Nepal through decades of relationships and reach.",
        ctaLabel: "Brand Partners",
        ctaHref: "/brand-partners",
      },
      {
        id: "mobil",
        image: "/assets/hero-image/mobil.png",
        eyebrow: "Lubricants",
        label: "Mobil Nepal",
        titleTop: "Performance That",
        titleBottom: "Moves Industry.",
        description:
          "Authorised distribution of world-leading lubricants, keeping vehicles, plants and machinery running at peak efficiency.",
        ctaLabel: "Explore Portfolio",
        ctaHref: "/businesses",
      },
    ],
  },

  aboutHome: {
    eyebrow: "About JB Group",
    titleLine1: "Why",
    titleLine2: "We Are.",
    image: "/assets/company profile/company profile pic.png",
    dropCap: "W",
    paragraphs: [
      "e exist to build businesses that last, rooted in a journey that began in Nepal in 1982 with Reliance Trade International Pvt. Ltd. What began as a focused trading business importing quality lubricants into Nepal has evolved over more than four decades into a purpose-driven group.",
      "Our reason for being is simple: to create lasting value through market knowledge, disciplined execution, trusted partnerships, and a genuine commitment to understanding changing customer needs. Today, that purpose drives businesses spanning lubricants and energy storage solutions, LPG bottling, electric mobility, commercial real estate, and strategic investments in future-oriented sectors.",
      "JB Group is built on a simple belief: strong businesses are created by understanding markets, serving customers reliably, empowering people, building enduring partnerships and growing responsibly.",
    ],
    stats: [
      { id: "years", value: "45+", label: "Years" },
      { id: "companies", value: "6+", label: "Companies" },
      { id: "brands", value: "10+", label: "Brands" },
      { id: "employees", value: "100+", label: "Employees" },
    ],
    ctaLabel: "About The Group",
    ctaHref: "/about",
  },

  purpose: {
    eyebrow: "Our Purpose",
    items: [
      {
        id: "mission",
        label: "Mission",
        title: "Building businesses that last.",
        text: "To build and grow diversified businesses that create lasting value through market knowledge, disciplined execution, trusted partnerships and a genuine commitment to serving our customers, employees and communities.",
      },
      {
        id: "vision",
        label: "Vision",
        title: "Trusted. Forward-thinking. Enduring.",
        text: "To be a trusted, forward-thinking business group in Nepal, recognized for our integrity, innovation and enduring impact across the sectors we serve.",
      },
    ],
  },

  businessesSection: {
    subtitle: "Diversification & Growth",
    titleLine1: "Our",
    titleLine2: "Businesses",
    intro:
      "JB Group is built on a simple belief: strong businesses are created by understanding markets, serving customers reliably, empowering people, building enduring partnerships and growing responsibly.",
  },

  businesses: [
    {
      id: "reliance-trade-international",
      slug: "reliance-trade-international",
      title: "Reliance Trade International",
      icon: "Zap",
      cardImage: "/assets/Our Businesses/reliance.png",
      heroImage: "/assets/reliance-gallery/cover-image.png",
      description:
        "Lubricants & Energy Storage. Serving automotive, industrial and aviation lubricant markets.",
      overview:
        "Reliance Trade International Pvt. Ltd. is the foundation of JB Group's business journey. Established in 1982, the company built reputation through the import, marketing and distribution of quality products in Nepal. Over the decades, Reliance Trade International developed deep experience in the lubricant market, serving automotive, commercial, industrial and specialized applications. Its lubricant portfolio includes internationally recognized brands such as Mobil and IPOL, as well as trusted battery brands. Building on its distribution capabilities and understanding of evolving energy requirements, the company has expanded into modern energy-storage and power-backup solutions. Our focus remains consistent: authentic products, dependable availability, strong market relationships and responsive customer service.",
      details: [
        "Automotive & Commercial vehicle lubricants",
        "Industrial & Aviation lubricants",
        "Lubrication-related products and solutions",
        "Lithium batteries & Inverters",
        "Power-backup solutions",
      ],
      stats: [
        { id: "s1", label: "Established", value: "1982" },
        { id: "s2", label: "Lubricants", value: "Mobil & IPOL" },
        { id: "s3", label: "Batteries", value: "Volta & Eastman" },
      ],
      features: [
        {
          id: "f1",
          title: "Mobil Lubricants",
          description:
            "World-class synthetic and conventional engine oils for automotive and industrial applications. Ensuring peak performance and protection.",
          image: "/assets/reliance-gallery/mobil.png",
        },
        {
          id: "f2",
          title: "IPOL Lubricants",
          description:
            "High-quality lubricants designed for diverse industrial and automotive needs, offering reliability and efficiency.",
          image: "/assets/reliance-gallery/ipol.jpg",
        },
        {
          id: "f3",
          title: "Eastman Batteries",
          description:
            "Advanced battery technology providing robust power backup for commercial and residential applications.",
          image: "/assets/reliance-gallery/eastman.jpg",
        },
        {
          id: "f4",
          title: "Volta Batteries",
          description:
            "Dependable energy storage solutions for automotive and backup power, built to last in demanding conditions.",
          image: "/assets/reliance-gallery/volta.jpg",
        },
      ],
      brands: [
        { id: "b1", name: "Mobil", logo: "/assets/reliance-gallery/logo/Mobil-logo.png" },
        { id: "b2", name: "IPOL", logo: "/assets/reliance-gallery/logo/ipol-Logo.png" },
        { id: "b3", name: "Volta", logo: "/assets/reliance-gallery/logo/logo-01.png" },
        { id: "b4", name: "Eastman", logo: "/assets/reliance-gallery/logo/Eastman Logo.png" },
      ],
      gallery: [
        "/assets/reliance-gallery/cover-image.png",
        "/assets/reliance-gallery/mobil.png",
        "/assets/reliance-gallery/eastman.jpg",
        "/assets/reliance-gallery/volta.jpg",
        "/assets/reliance-gallery/ipol.jpg",
      ],
      published: true,
      order: 0,
    },
    {
      id: "kabsons-industries",
      slug: "kabsons-industries",
      title: "Kabsons Industries",
      icon: "Flame",
      cardImage: "/assets/Our Businesses/kabsonnew.png",
      tagline: "LPG Bottling",
      status: "Expansion",
      heroImage: "/assets/Kabsons/lpg_bottling_plant.jpg",
      description:
        "LPG Bottling. Strengthening the Group's presence in Nepal's essential energy sector.",
      overview:
        "Kabsons Industries Pvt. Ltd. represents JB Group's presence in Nepal's LPG sector and marks an important step in the Group's diversification into essential energy businesses. The company operates an LPG bottling facility in Dhading and supports the supply of LPG to the Nepalese market through disciplined operations, safety-focused processes and dependable service. Kabsons reflects JB Group's approach to diversification: identify a meaningful opportunity, invest strategically, strengthen operations and build long-term value.",
      details: [
        "LPG bottling",
        "Operational safety and reliability",
        "Efficient plant operations",
        "Dependable market service",
        "Long-term participation in Nepal's energy ecosystem",
      ],
      stats: [
        { id: "s1", label: "Sector", value: "Energy" },
        { id: "s2", label: "Facility", value: "Dhading" },
        { id: "s3", label: "Operation", value: "Bottling" },
      ],
      features: [],
      brands: [
        {
          id: "b1",
          name: "Shreemaya Gas",
          logo: "/assets/Kabsons/shreemaya logo-np.png",
          fallbackText: "Shreemaya Gas",
        },
      ],
      gallery: [
        "/assets/Kabsons/lpg_bottling_plant.jpg",
      ],
      published: true,
      order: 1,
    },
    {
      id: "hipco-trading",
      slug: "hipco-trading",
      title: "HIPCO Trading",
      icon: "Car",
      cardImage: "/assets/Our Businesses/hipco.png",
      heroImage: "https://images.unsplash.com/photo-1588011930968-eadac80e6a5a?w=1600&q=80",
      logo: "/assets/hipco-logo.png",
      description: "Electric Mobility. Representing Montra electric three-wheelers in Nepal.",
      overview:
        "HIPCO Trading Pvt. Ltd. represents JB Group's growing commitment to the future of mobility in Nepal. The company represents Montra Electric Vehicles in Nepal in the electric three-wheeler segment and is developing capabilities across sales, distribution, dealer development, customer support and after-sales service. As electric mobility continues to evolve, HIPCO is expanding its presence beyond a single product category with the objective of building a broader and sustainable e-mobility platform for Nepal.",
      details: [
        "Montra electric three-wheelers",
        "Electric vehicle sales and distribution",
        "Dealer network development",
        "Customer and fleet engagement",
        "After-sales and service support",
        "Vehicle financing partnerships",
      ],
      stats: [
        { id: "s1", label: "EV Brand", value: "Montra" },
        { id: "s2", label: "Focus", value: "Clean Tech" },
        { id: "s3", label: "Support", value: "After-sales" },
      ],
      features: [],
      brands: [
        {
          id: "b1",
          name: "Montra",
          logo: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&q=80",
          fallbackText: "Montra Electric",
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&q=80",
        "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80",
        "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=800&q=80",
      ],
      published: true,
      order: 2,
    },
    {
      id: "jb-group-investments",
      slug: "jb-group-investments",
      title: "JB Group Investments",
      icon: "Briefcase",
      cardImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80",
      description:
        "Strategic Investments. Investing in future technology companies and the financial sector.",
      overview:
        "JB Group actively evaluates strategic investment opportunities that can create long-term value and complement the Group's existing businesses. Our investment approach is focused on sectors shaped by technology, changing consumer behavior and Nepal's evolving economic landscape. We seek opportunities where capital can be combined with market understanding, partnerships and disciplined execution to create sustainable long-term value.",
      details: [
        "Future technology companies",
        "Digital and technology-enabled businesses",
        "Strategic investments in the financial sector",
        "Emerging business models",
        "Mobility and energy-related opportunities",
        "Long-term strategic equity investments",
      ],
      stats: [
        { id: "s1", label: "Approach", value: "Strategic" },
        { id: "s2", label: "Focus", value: "Long-term" },
        { id: "s3", label: "Capital", value: "Disciplined" },
      ],
      features: [],
      brands: [],
      gallery: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
      ],
      published: true,
      order: 3,
    },
    {
      id: "bnj-properties",
      slug: "bnj-properties",
      title: "BNJ Properties",
      icon: "Building2",
      cardImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80",
      description:
        "Commercial Real Estate & Warehousing. Developing practical and strategically located facilities.",
      overview:
        "BNJ Properties represents JB Group's interests in commercial real estate and property-based business infrastructure. The business develops and manages commercial spaces and warehouse assets designed to serve companies seeking practical, well-managed and strategically located facilities. Our objective is to create and manage business spaces that support the operational needs of modern enterprises while generating sustainable long-term asset value.",
      details: [
        "Commercial business centres",
        "Office and commercial space leasing",
        "Warehouse leasing",
        "Commercial property management",
        "Future commercial property development",
      ],
      stats: [
        { id: "s1", label: "Sector", value: "Real Estate" },
        { id: "s2", label: "Focus", value: "Commercial" },
        { id: "s3", label: "Assets", value: "Warehousing" },
      ],
      features: [],
      brands: [],
      gallery: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      ],
      published: true,
      order: 4,
    },
  ],

  leadership: {
    heroTitleTop: "The",
    heroTitleBottom: "Leadership",
    heroSubtitle: "Generations of Enterprise. One Shared Vision.",
    heroImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=80",
    heritageHeading: "Our Heritage",
    heritageParagraphs: [
      "JB Group brings together a long family tradition of entrepreneurship with experienced leadership and a fourth generation focused on diversification, innovation and responsible growth.",
      "The Group’s leadership combines continuity of values with the ambition to build businesses that are relevant to Nepal’s evolving economy. The Jajodia family’s entrepreneurial roots extend across generations, with earlier family businesses spanning fuel retailing, medicines, electronics, textiles, construction materials and general trading.",
      "This heritage of identifying opportunities, building relationships and adapting to changing markets continues to shape JB Group today.",
    ],
    pullQuote: "Experience. Entrepreneurship. Continuity. Progress.",
    boardHeading: "The Board",
    closingQuote:
      "Together, JB Group’s leadership remains committed to preserving the values built across generations while creating stronger businesses, developing trusted partnerships and pursuing sustainable long-term growth.",
    closingImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=2000&q=80",
    leaders: [
      {
        id: "subhas-jajodia",
        name: "Subhas Jajodia",
        role: "Founder & Chairman",
        photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
        bio: [
          "Mr. Subhas Jajodia represents the third generation of the family’s entrepreneurial legacy and has played a central role in carrying that business tradition into the modern era.",
          "He has guided the journey that developed through Reliance Trade International from 1982 and the subsequent expansion into new business areas.",
          "With decades of business experience, he has emphasized integrity, trust, quality, disciplined execution and long-term relationships. These principles continue to provide the foundation for JB Group as it brings diverse businesses together under a common vision and prepares for its next phase of growth.",
        ],
        published: true,
        order: 0,
      },
      {
        id: "ashish-jajodia",
        name: "Ashish Jajodia",
        role: "Joint Managing Director",
        photo: "/assets/Leadership/Ashish Jajodia.jpg",
        bio: [
          "Mr. Ashish Jajodia represents the fourth generation of the family’s entrepreneurial journey and plays an active role in JB Group’s strategic direction, diversification and business development.",
          "He has served as Managing Director of Kabsons Industries since 2015 and has entrepreneurial experience across multiple sectors, including dairy through Modern Dairy Industries, agriculture, trading and travel technology through mytrip2nepal.com.",
          "He is also actively involved in industry associations and social service organizations, reflecting his interest in both business development and community engagement.",
        ],
        published: true,
        order: 1,
      },
      {
        id: "siddarth-jajodia",
        name: "Siddarth Jajodia",
        role: "Joint Managing Director",
        photo: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80",
        bio: [
          "Mr. Siddarth Jajodia represents the fourth generation of the family’s entrepreneurial journey and is actively involved in the Group’s trading, distribution, strategic partnerships and new-generation mobility businesses.",
          "He leads Reliance Trade International Pvt. Ltd. and is closely involved in developing JB Group’s electric mobility initiatives through HIPCO Trading Pvt. Ltd., including the representation and growth of Montra Electric Vehicles in Nepal.",
          "His focus is on strengthening established businesses, building long-term partnerships and developing new opportunities aligned with the Group’s future direction.",
        ],
        published: true,
        order: 2,
      },
    ],
  },

  timeline: {
    eyebrow: "Since 1982",
    titleLine1: "The",
    titleLine2: "Journey.",
    subtitle: "Four Decades of Experience. One Continuing Journey.",
    items: [
      {
        id: "t1",
        year: "1982",
        title: "Foundation",
        desc: "Reliance Trade International begins its journey in Nepal with lubricants and trading.",
      },
      {
        id: "t2",
        year: "Growth",
        title: "Market Expansion",
        desc: "Expansion across automotive, industrial and lubricant markets, supported by strong distribution.",
      },
      {
        id: "t3",
        year: "Evolve",
        title: "Diversification",
        desc: "Entry into complementary energy and industrial opportunities, broadening the Group's experience.",
      },
      {
        id: "t4",
        year: "2015",
        title: "LPG Sector",
        desc: "Expansion into the LPG sector through Kabsons Industries Pvt. Ltd.",
      },
      {
        id: "t5",
        year: "Mobility",
        title: "New Mobility",
        desc: "HIPCO Trading develops the Group's presence in electric mobility.",
      },
      {
        id: "t6",
        year: "Assets",
        title: "Property & Investments",
        desc: "Expansion into commercial real estate, warehousing and strategic investments.",
      },
      {
        id: "t7",
        year: "Today",
        title: "JB Group",
        desc: "A unified corporate identity bringing businesses and future opportunities together.",
      },
    ],
  },

  aboutPage: {
    heroTitleTop: "The Story of",
    heroTitleBottom: "JB Group",
    heroSubtitle: "Believing · Growing · Leading",
    heroImage: "/assets/company profile/company profile pic.png",
    heritageHeading: "Our Heritage",
    heritageParagraphs: [
      "JB Group represents the next chapter of a business journey that began in Nepal in 1982 with Reliance Trade International Pvt. Ltd. What began as a focused trading business importing quality lubricants into Nepal has evolved over more than four decades through market knowledge, disciplined execution, trusted partnerships and a commitment to understanding changing customer needs.",
      "Today, the Group's businesses span lubricants and energy storage solutions, LPG bottling, electric mobility, commercial real estate and strategic investments in future-oriented sectors. JB Group is built on a simple belief: strong businesses are created by understanding markets, serving customers reliably, empowering people, building enduring partnerships and growing responsibly.",
      "Our journey has always been about more than products. It is about trust, relationships, reliability and the confidence to grow. As we expand into new sectors, we carry forward the entrepreneurial spirit that has defined our family for generations, blending traditional values with modern business practices.",
    ],
    philosophyHeading: "Our Philosophy",
    philosophyItems: [
      { id: "p1", title: "BELIEVING", text: "In people, partnerships and possibilities." },
      { id: "p2", title: "GROWING", text: "Through continuous improvement and expansion." },
      { id: "p3", title: "LEADING", text: "With integrity, quality, and purpose." },
    ],
    quote:
      "Our journey has always been about more than products. It is about trust, relationships, reliability and the confidence to grow.",
    visionTitle: "Vision",
    visionText:
      "To build a trusted, diversified and future-ready business group that creates sustainable value through excellence, innovation, responsible growth and enduring relationships.",
    missionTitle: "Mission",
    missionText:
      "To create lasting value by delivering dependable products, operating with integrity, embracing innovation and continuously improving the way we do business.",
    coreValuesHeading: "The Pillars of Our Success",
    coreValuesWatermark: "CORE VALUES",
    coreValues: [
      { id: "v1", title: "Integrity", text: "We conduct business honestly, ethically and transparently." },
      { id: "v2", title: "Quality", text: "We believe quality is a responsibility, not an option." },
      { id: "v3", title: "Reliability", text: "We keep our commitments and strive to be a dependable partner." },
      { id: "v4", title: "Customer Focus", text: "We listen, understand and respond to evolving customer needs." },
      { id: "v5", title: "Innovation", text: "We embrace new ideas, technologies and opportunities." },
      { id: "v6", title: "Responsibility", text: "We pursue growth that creates value for business and society." },
    ],
  },

  brandPartners: {
    heroTitleTop: "Brand &",
    heroTitleBottom: "Businesses Partners",
    heroSubtitle: "Growing together through trusted partnerships",
    heroImage: "/assets/company profile/company profile pic.png",
    sectionEyebrow: "Our Network",
    sectionHeading: "Businesses & Brands",
    emptyStateText: "Operating as independent entity",
  },

  contact: {
    heroEyebrow: "We'd Love to Hear From You",
    heroTitle: "Get in",
    heroTitleAccent: "Touch",
    heroSubtitle: "Reach out and our team will get back to you within 24 hours.",
    phone: "+977-1-5361050",
    phoneSub: "Sun–Fri, 10AM–6PM",
    email: "contact@jbgroup.com",
    emailSub: "Reply within 24 hours",
    addressTitle: "BNJ Tower",
    addressSub: "Tripureshwor, Kathmandu",
    hoursValue: "Sun – Fri",
    hoursSub: "10:00 AM – 6:00 PM",
    hoursNote: "We're open now",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8073226220924!2d85.31025007526997!3d27.69369907619516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190ac44d2b45%3A0x7e55df09b1a4c55f!2sTripureshwor%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1694000000000!5m2!1sen!2snp",
    mapDirectionsUrl: "https://maps.google.com/?q=Tripureshwor,Kathmandu,Nepal",
    socials: [
      { id: "li", platform: "Linkedin", url: "#" },
      { id: "fb", platform: "Facebook", url: "#" },
      { id: "ig", platform: "Instagram", url: "#" },
      { id: "yt", platform: "Youtube", url: "#" },
    ],
    inquiryTypes: [
      { id: "general", label: "General Inquiry" },
      { id: "partnership", label: "Business Partnership" },
      { id: "careers", label: "Careers" },
      { id: "investor", label: "Investor Relations" },
      { id: "media", label: "Media & Press" },
    ],
    companies: [
      { id: "", label: "Please select a company..." },
      { id: "jb_group", label: "JB Group (General)" },
      { id: "reliance_trade", label: "Reliance Trade International" },
      { id: "lpg", label: "LPG Bottling & Distribution" },
      { id: "ev", label: "Electric Mobility" },
      { id: "real_estate", label: "Commercial Real Estate" },
      { id: "other", label: "Other" },
    ],
    successTitle: "Message Sent!",
    successMessage:
      "Thank you for reaching out. Our team will get back to you within 24 hours.",
    privacyNote:
      "By submitting, you agree to our privacy policy. We'll never share your information.",
  },

  footer: {
    ctaEyebrow: "Let's Work Together",
    ctaTitleTop: "Interested in partnering",
    ctaTitleBottom: "with JB Group?",
    ctaButtonLabel: "Contact Us",
    ctaButtonHref: "/contact",
    tagline: "Believing · Growing · Leading",
    blurb:
      "A diversified business group built on more than four decades of enterprise in Nepal.",
    socials: [
      { id: "li", platform: "Linkedin", url: "#" },
      { id: "tw", platform: "Twitter", url: "#" },
      { id: "fb", platform: "Facebook", url: "#" },
      { id: "ig", platform: "Instagram", url: "#" },
      { id: "yt", platform: "Youtube", url: "#" },
    ],
    companyHeading: "Company",
    companyLinks: [
      { id: "c1", label: "About", href: "/about" },
      { id: "c2", label: "Our Journey", href: "/about#journey" },
      { id: "c3", label: "Leadership", href: "/leadership" },
      { id: "c4", label: "Contact", href: "/contact" },
    ],
    businessesHeading: "Businesses",
    contactHeading: "Contact",
    addressLines: ["BNJ Tower, Tripureshwor", "Kathmandu, Nepal"],
    contactExtraLink: { id: "x1", label: "Brands & Partnerships", href: "/brand-partners" },
    copyright: "© JB Group. All Rights Reserved.",
    watermark: "JB GROUP",
  },

  nav: {
    items: [
      { id: "n1", label: "Home", href: "/" },
      { id: "n2", label: "About", href: "/about" },
      { id: "n4", label: "Brand & Businesses Partners", href: "/brand-partners" },
      { id: "n5", label: "Leadership", href: "/leadership" },
      { id: "n6", label: "Contact Us", href: "/contact" },
    ],
    megaMenuGroup1Heading: "Industries, Trading, Mobility & Energy",
    megaMenuGroup2Heading: "Investments & Properties",
  },

  settings: {
    siteTitle: "JB Group",
    metaDescription:
      "A diversified business group built on more than four decades of enterprise in Nepal.",
    brandBlue: "#111D43",
    brandGold: "#CB9733",
    loaderEnabled: true,
    loaderDurationMs: 1500,
  },
};

/** Section keys in the order the dashboard sidebar presents them. */
export const SECTION_KEYS = Object.keys(DEFAULT_CONTENT) as (keyof SiteContent)[];
