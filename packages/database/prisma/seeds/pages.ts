import { PrismaClient, Store } from '@prisma/client';

interface PageData {
  title: string;
  slug: string;
  content: string;
  template: 'default' | 'full-width' | 'sidebar' | 'landing';
  status: 'draft' | 'published';
  showInNav: boolean;
  navOrder: number;
  seoTitle?: string;
  seoDescription?: string;
}

// Generate store-specific About page content
const generateAboutContent = (storeKey: string): string => {
  const aboutContent: Record<string, string> = {
    ramlit: `# About Ramlit Limited

## Transforming Businesses Through Technology

Ramlit Limited is a global software and IT services company dedicated to helping organizations achieve their digital transformation goals. Since our founding, we have been at the forefront of technological innovation, delivering secure, scalable solutions that drive business success.

## Our Mission

To empower businesses with cutting-edge technology solutions that enable growth, efficiency, and competitive advantage in an increasingly digital world.

## Our Expertise

### AI & Machine Learning
We leverage artificial intelligence to automate processes, gain insights from data, and create intelligent applications that learn and improve over time.

### DevOps Excellence
Our DevOps practices streamline development and operations, enabling faster delivery, improved reliability, and continuous innovation.

### Cloud Solutions
From migration to optimization, we help organizations harness the full power of cloud computing across AWS, Azure, and Google Cloud platforms.

### Cybersecurity
Security is embedded in everything we do, ensuring your systems and data remain protected against evolving threats.

## Our Values

- **Innovation**: We constantly push boundaries to deliver breakthrough solutions
- **Integrity**: We build trust through transparency and ethical practices
- **Excellence**: We are committed to delivering the highest quality in everything we do
- **Collaboration**: We work as partners with our clients to achieve shared success

## Global Presence

With teams across North America, Europe, and Asia, we serve clients worldwide, bringing global expertise with local understanding.

## Let's Build Something Great Together

Ready to transform your business? Contact us to discuss how Ramlit can help you achieve your technology goals.`,

    colorpark: `# About ColorPark

## Where Creativity Meets Strategy

ColorPark is a full-service creative design agency dedicated to helping brands stand out in a crowded marketplace. We believe that great design is more than aesthetics—it's about creating meaningful connections between brands and their audiences.

## Our Story

Founded by a team of passionate designers and strategists, ColorPark was born from a simple belief: every brand deserves design that truly represents who they are and resonates with who they want to reach.

## What We Do

### Brand Identity
We create comprehensive brand identities that capture your essence and communicate your values at every touchpoint.

### UI/UX Design
User-centered design that delights users and drives results, from websites to mobile applications.

### Web Design
Beautiful, functional websites that convert visitors into customers and reflect your brand perfectly.

### Packaging Design
Eye-catching packaging that stands out on shelves and creates memorable unboxing experiences.

### Social Media & Graphics
Consistent, engaging visual content that builds your presence across all platforms.

## Our Approach

1. **Discover**: We dive deep into understanding your brand, audience, and goals
2. **Design**: We explore creative possibilities and refine the perfect solution
3. **Deliver**: We provide polished assets ready for implementation
4. **Support**: We continue to partner with you as your brand evolves

## Our Team

Our diverse team brings together expertise in graphic design, illustration, user experience, motion graphics, and brand strategy. We're united by our passion for creating work that makes a difference.

## Recognition

Our work has been recognized by leading design publications and awards, but our greatest achievement is the success of our clients.

## Start Your Project

Ready to elevate your brand? Let's create something beautiful together.`,

    xcybersecurity: `# About xCyberSecurity

## Defending Your Digital Assets

xCyberSecurity is a premier cybersecurity services firm dedicated to protecting organizations from evolving cyber threats. With a team of world-class security experts, we provide comprehensive security solutions that safeguard your business, data, and reputation.

## Our Mission

To empower organizations with the knowledge, tools, and expertise needed to defend against cyber threats and build resilient security postures.

## Our Services

### Penetration Testing
We simulate real-world attacks to identify vulnerabilities before malicious actors can exploit them.

### Vulnerability Assessment
Comprehensive scanning and analysis to identify and prioritize security weaknesses across your environment.

### Managed Security
24/7 monitoring, detection, and response services that provide enterprise-grade security without the enterprise budget.

### Compliance
Expert guidance through SOC 2, ISO 27001, PCI DSS, HIPAA, and other regulatory frameworks.

### Incident Response
Rapid response and forensic capabilities to minimize damage and recover quickly from security incidents.

### Security Training
Education programs that transform your employees from potential vulnerabilities into your first line of defense.

## Why xCyberSecurity?

### Expert Team
Our security professionals hold certifications including OSCP, CISSP, CEH, GPEN, and more. Many have backgrounds in military and government security.

### Proven Methodology
We follow industry-standard frameworks and continuously evolve our approaches based on the latest threat intelligence.

### Client-Centric Approach
We don't just find problems—we help you fix them with clear, prioritized remediation guidance.

### Trusted by Industry Leaders
Fortune 500 companies, financial institutions, healthcare organizations, and government agencies trust us with their security.

## Our Commitment

We are committed to:
- Maintaining the highest ethical standards
- Protecting client confidentiality
- Continuous improvement and learning
- Contributing to the security community

## Protect Your Organization

Cyber threats don't wait. Contact us for a security assessment and take the first step toward a stronger security posture.`,
  };

  return aboutContent[storeKey] || aboutContent.ramlit;
};

// Generate store-specific Services page content
const generateServicesContent = (storeKey: string): string => {
  const servicesContent: Record<string, string> = {
    ramlit: `# Our Services

## Technology Solutions for Modern Businesses

At Ramlit Limited, we offer comprehensive technology services designed to help your organization thrive in the digital age.

---

## AI & Machine Learning

Transform your business with intelligent solutions.

- **AI Strategy Consulting**: Roadmap for AI adoption
- **Custom ML Models**: Purpose-built machine learning solutions
- **AI Integration**: Embed AI into existing workflows
- **Data Analytics**: Turn data into actionable insights

---

## DevOps & Cloud

Accelerate delivery and improve reliability.

- **CI/CD Implementation**: Automated build and deployment pipelines
- **Kubernetes Services**: Container orchestration at scale
- **Infrastructure as Code**: Reproducible, version-controlled infrastructure
- **Cloud Migration**: Seamless transition to cloud platforms

---

## Software Development

Custom solutions for unique challenges.

- **Full-Stack Development**: End-to-end application development
- **API Development**: RESTful and GraphQL APIs
- **Mobile Applications**: Cross-platform mobile solutions
- **Legacy Modernization**: Update and optimize existing systems

---

## Security Services

Protect your digital assets.

- **Security Assessments**: Identify and remediate vulnerabilities
- **Compliance Support**: Meet regulatory requirements
- **Security Architecture**: Design secure systems from the ground up

---

## Consulting & Support

Expert guidance and reliable support.

- **Technology Strategy**: Align technology with business goals
- **24/7 Support**: Round-the-clock technical assistance
- **Training**: Upskill your team on modern technologies

---

## Ready to Get Started?

Contact us today to discuss how our services can help transform your business.`,

    colorpark: `# Our Services

## Creative Solutions for Bold Brands

From logo design to complete brand transformations, ColorPark delivers creative services that make your brand unforgettable.

---

## Logo & Brand Identity

Build a foundation for your brand.

- **Logo Design**: Memorable marks that represent your brand
- **Brand Identity Systems**: Comprehensive visual language
- **Brand Guidelines**: Documentation for consistent application
- **Brand Refresh**: Modernize your existing identity

---

## UI/UX Design

Create experiences users love.

- **Website UI/UX**: User-centered web design
- **Mobile App Design**: Native iOS and Android interfaces
- **Dashboard Design**: Data-rich interfaces that inform
- **UX Audits**: Identify and fix usability issues

---

## Web Design

Websites that work as hard as you do.

- **Landing Pages**: High-converting page design
- **E-commerce Design**: Online stores that sell
- **Corporate Websites**: Professional digital presence
- **Web Applications**: Complex web-based tools

---

## Social Media & Graphics

Stand out in every feed.

- **Social Media Templates**: Consistent content creation
- **Monthly Content**: Ongoing design support
- **Digital Advertising**: Banner and ad design
- **Presentation Design**: Pitch decks that impress

---

## Illustration & Icons

Custom artwork for your brand.

- **Custom Illustrations**: Unique brand artwork
- **Icon Sets**: Consistent iconography
- **Infographics**: Data visualization design
- **Character Design**: Brand mascots and characters

---

## Packaging Design

Make your product stand out.

- **Product Packaging**: Primary and secondary packaging
- **Label Design**: Product labels and wraps
- **Box Design**: Custom packaging solutions
- **Mockups**: Realistic product presentations

---

## Let's Create Together

Every great brand starts with a conversation. Reach out to discuss your project.`,

    xcybersecurity: `# Our Services

## Comprehensive Cybersecurity Solutions

xCyberSecurity provides end-to-end security services to protect your organization from cyber threats.

---

## Penetration Testing

Find vulnerabilities before attackers do.

- **Web Application Testing**: OWASP-based assessments
- **Network Penetration Testing**: Internal and external testing
- **Mobile App Security**: iOS and Android testing
- **API Security Testing**: REST and GraphQL assessments
- **Red Team Engagements**: Full-scope adversary simulation

---

## Vulnerability Assessment

Know your attack surface.

- **Vulnerability Scanning**: Automated discovery
- **Cloud Security Assessment**: AWS, Azure, GCP review
- **Configuration Reviews**: Baseline compliance checking
- **Continuous Monitoring**: Ongoing vulnerability management

---

## Managed Security Services

Enterprise security, scaled to fit.

- **SOC Services**: 24/7 monitoring and response
- **Managed Detection & Response**: Advanced threat hunting
- **SIEM Management**: Log analysis and correlation
- **Endpoint Protection**: EDR deployment and management

---

## Compliance Services

Navigate complex regulations.

- **SOC 2 Preparation**: Type I and Type II readiness
- **ISO 27001 Implementation**: ISMS development
- **PCI DSS Compliance**: Payment card security
- **HIPAA Security**: Healthcare compliance
- **GDPR Support**: Data protection compliance

---

## Incident Response

Rapid response when it matters most.

- **IR Retainer**: Pre-arranged response services
- **Digital Forensics**: Evidence collection and analysis
- **Breach Investigation**: Root cause analysis
- **Recovery Support**: Business continuity assistance

---

## Security Training

Turn your team into your defense.

- **Security Awareness**: Employee training programs
- **Phishing Simulations**: Test and train staff
- **Technical Training**: Developer and IT security
- **Executive Briefings**: Leadership security education

---

## Protect Your Business

Start with a free security consultation. Contact us today.`,
  };

  return servicesContent[storeKey] || servicesContent.ramlit;
};

// Common pages for all stores
const generateCommonPages = (storeKey: string, storeName: string): PageData[] => [
  {
    title: 'About Us',
    slug: 'about',
    content: generateAboutContent(storeKey),
    template: 'default',
    status: 'published',
    showInNav: true,
    navOrder: 1,
    seoTitle: `About ${storeName}`,
    seoDescription: `Learn about ${storeName}, our mission, values, and the team behind our success.`,
  },
  {
    title: 'Our Services',
    slug: 'services',
    content: generateServicesContent(storeKey),
    template: 'default',
    status: 'published',
    showInNav: true,
    navOrder: 2,
    seoTitle: `Services | ${storeName}`,
    seoDescription: `Explore the comprehensive range of services offered by ${storeName}.`,
  },
  {
    title: 'Contact Us',
    slug: 'contact',
    content: `# Contact Us

## Get in Touch

We'd love to hear from you. Reach out through any of the following channels.

### Email

For general inquiries: hello@${storeKey.toLowerCase()}.com

For support: support@${storeKey.toLowerCase()}.com

### Phone

Main Office: +1 (555) 123-4567

Support Hotline: +1 (555) 987-6543

### Office Location

123 Business District
Suite 500
New York, NY 10001
United States

### Business Hours

Monday - Friday: 9:00 AM - 6:00 PM EST
Saturday - Sunday: Closed

### Send Us a Message

Fill out our contact form and we'll get back to you within 24 hours.

[Contact Form Placeholder]

### Follow Us

Stay connected through our social media channels:
- LinkedIn
- Twitter
- Facebook
- Instagram`,
    template: 'default',
    status: 'published',
    showInNav: true,
    navOrder: 3,
    seoTitle: `Contact ${storeName}`,
    seoDescription: `Get in touch with ${storeName}. Find our contact information, office location, and business hours.`,
  },
  {
    title: 'Frequently Asked Questions',
    slug: 'faq',
    content: `# Frequently Asked Questions

Find answers to common questions about our services and processes.

---

## General Questions

### How do I get started?

The easiest way to get started is to contact us through our website or give us a call. We'll schedule an initial consultation to understand your needs and discuss how we can help.

### What industries do you serve?

We serve clients across a wide range of industries including technology, finance, healthcare, retail, and more. Our solutions are adaptable to various business contexts.

### Do you work with small businesses?

Yes! We work with organizations of all sizes, from startups to Fortune 500 companies. We have packages and solutions designed for different scales and budgets.

---

## Services & Pricing

### How is your pricing structured?

Our pricing depends on the scope and complexity of each project. We offer both project-based and retainer pricing models. Contact us for a custom quote.

### Do you offer ongoing support?

Yes, we offer various support and maintenance packages to ensure your continued success after project completion.

### Can I see examples of your work?

Absolutely! We have case studies and portfolio examples available. Contact us to see relevant work in your industry.

---

## Process & Timeline

### What is your typical project timeline?

Timelines vary based on project scope. During our initial consultation, we'll provide a detailed timeline estimate for your specific project.

### How do you communicate during projects?

We believe in transparent, regular communication. You'll have a dedicated point of contact and regular status updates throughout your project.

### What if I need changes during the project?

We build flexibility into our process. Minor adjustments are typically included, and we'll discuss any significant scope changes openly with you.

---

## Still Have Questions?

Contact our team and we'll be happy to help.`,
    template: 'default',
    status: 'published',
    showInNav: true,
    navOrder: 4,
    seoTitle: `FAQ | ${storeName}`,
    seoDescription: `Find answers to frequently asked questions about ${storeName}'s services, pricing, and processes.`,
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: `# Privacy Policy

**Last Updated: January 1, 2025**

This Privacy Policy describes how ${storeName} ("we", "us", or "our") collects, uses, and shares information about you when you use our website and services.

## Information We Collect

### Information You Provide

We collect information you provide directly, including:
- Contact information (name, email, phone number)
- Account credentials
- Payment information
- Communications with us
- Information in forms you submit

### Information Collected Automatically

We automatically collect certain information when you visit our website:
- IP address
- Browser type and version
- Operating system
- Pages visited and time spent
- Referring website
- Device information

## How We Use Your Information

We use the information we collect to:
- Provide and improve our services
- Process transactions
- Send communications
- Respond to inquiries
- Analyze usage patterns
- Comply with legal obligations

## How We Share Your Information

We may share your information with:
- Service providers who assist our operations
- Professional advisors
- Law enforcement when required
- Business partners with your consent

We do not sell your personal information.

## Your Rights and Choices

You have the right to:
- Access your personal information
- Correct inaccurate information
- Delete your information
- Opt out of marketing communications
- Request data portability

## Data Security

We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction.

## Contact Us

For privacy-related questions or to exercise your rights, contact us at:
privacy@${storeKey.toLowerCase()}.com`,
    template: 'default',
    status: 'published',
    showInNav: false,
    navOrder: 0,
    seoTitle: `Privacy Policy | ${storeName}`,
    seoDescription: `Read ${storeName}'s privacy policy to understand how we collect, use, and protect your personal information.`,
  },
  {
    title: 'Terms of Service',
    slug: 'terms-of-service',
    content: `# Terms of Service

**Last Updated: January 1, 2025**

These Terms of Service ("Terms") govern your use of ${storeName}'s website and services. By accessing or using our services, you agree to these Terms.

## Acceptance of Terms

By accessing or using our services, you confirm that you accept these Terms and agree to comply with them. If you do not agree, you may not use our services.

## Services Description

${storeName} provides professional services as described on our website. The specific scope, deliverables, and terms for individual projects will be defined in separate service agreements.

## User Responsibilities

When using our services, you agree to:
- Provide accurate and complete information
- Maintain the confidentiality of your account
- Use services only for lawful purposes
- Respect intellectual property rights
- Not interfere with our services or security

## Intellectual Property

All content on our website, including text, graphics, logos, and software, is our property or that of our licensors and is protected by intellectual property laws.

### Client Work

Ownership of work product created for clients will be defined in individual service agreements.

## Payment Terms

- Payment terms will be specified in service agreements
- Late payments may incur additional fees
- We reserve the right to suspend services for non-payment

## Limitation of Liability

To the maximum extent permitted by law, ${storeName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages.

## Indemnification

You agree to indemnify and hold harmless ${storeName} from any claims, damages, or expenses arising from your use of our services or violation of these Terms.

## Modifications

We reserve the right to modify these Terms at any time. Continued use after modifications constitutes acceptance of updated Terms.

## Governing Law

These Terms are governed by the laws of the State of New York, without regard to conflict of law principles.

## Contact

For questions about these Terms, contact us at:
legal@${storeKey.toLowerCase()}.com`,
    template: 'default',
    status: 'published',
    showInNav: false,
    navOrder: 0,
    seoTitle: `Terms of Service | ${storeName}`,
    seoDescription: `Read ${storeName}'s terms of service governing the use of our website and services.`,
  },
  {
    title: 'Refund Policy',
    slug: 'refund-policy',
    content: `# Refund Policy

**Last Updated: January 1, 2025**

At ${storeName}, we are committed to delivering high-quality services and ensuring client satisfaction. This policy outlines our approach to refunds and cancellations.

## Service-Based Refunds

### Before Project Commencement

If you cancel before any work has begun, you are entitled to a full refund of any deposits paid, minus any non-refundable reservation fees specified in your agreement.

### During Project Execution

- Work completed up to the cancellation date will be billed
- Unused portions of pre-paid fees may be refunded
- Refund amounts will be calculated on a pro-rata basis

### After Project Completion

Once deliverables have been accepted and the project is complete, refunds are generally not available. However, we are committed to addressing any concerns about the quality of work.

## Satisfaction Guarantee

We stand behind our work. If you're not satisfied with delivered work:

1. Contact us within 7 days of delivery
2. Describe the specific concerns
3. We will work with you to revise the deliverables
4. If we cannot resolve the issue, we'll discuss appropriate remedies

## Non-Refundable Items

The following are generally non-refundable:
- Third-party costs (licenses, subscriptions, etc.)
- Rush fees once expedited work has begun
- Consultation time that has been used

## How to Request a Refund

To request a refund:

1. Email refunds@${storeKey.toLowerCase()}.com
2. Include your project/order details
3. Explain the reason for your request
4. We'll respond within 3 business days

## Processing Time

Approved refunds will be processed within 5-10 business days to the original payment method.

## Questions

For questions about our refund policy, contact our support team.`,
    template: 'default',
    status: 'published',
    showInNav: false,
    navOrder: 0,
    seoTitle: `Refund Policy | ${storeName}`,
    seoDescription: `Learn about ${storeName}'s refund policy, cancellation procedures, and satisfaction guarantee.`,
  },
];

// Store name mapping
const storeNames: Record<string, string> = {
  ramlit: 'Ramlit Limited',
  colorpark: 'ColorPark',
  xcybersecurity: 'xCyberSecurity',
};

export async function seedPages(prisma: PrismaClient, stores: Record<string, Store>) {
  console.log('  Creating pages for all stores...');

  let totalPages = 0;

  for (const [storeKey, store] of Object.entries(stores)) {
    const storeName = storeNames[storeKey] || store.name;
    const pages = generateCommonPages(storeKey, storeName);

    for (const page of pages) {
      await prisma.page.upsert({
        where: { storeId_slug: { storeId: store.id, slug: page.slug } },
        update: {
          title: page.title,
          content: page.content,
          template: page.template,
          status: page.status,
          showInNav: page.showInNav,
          navOrder: page.navOrder,
          seoTitle: page.seoTitle,
          seoDescription: page.seoDescription,
          publishedAt: page.status === 'published' ? new Date() : null,
        },
        create: {
          storeId: store.id,
          title: page.title,
          slug: page.slug,
          content: page.content,
          template: page.template,
          status: page.status,
          showInNav: page.showInNav,
          navOrder: page.navOrder,
          seoTitle: page.seoTitle,
          seoDescription: page.seoDescription,
          publishedAt: page.status === 'published' ? new Date() : null,
        },
      });
      totalPages++;
    }
  }

  console.log(`  Created ${totalPages} pages across all stores`);
}
