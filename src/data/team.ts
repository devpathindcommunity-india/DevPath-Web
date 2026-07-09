export type TeamCategory =
  | 'Founder'
  | 'Core Leadership'
  | 'Technical Lead'
  | 'Technical Contributor'
  | 'City Lead'
  | 'Moderator'
  | 'Volunteer';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  subRole?: string;
  image?: string;
  category: TeamCategory;
  socials?: {
    github?: string;
    linkedin?: string;
    instagram?: string;
  };
}

const getPlaceholder = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

export const teamMembers: TeamMember[] = [
  // Founder
  {
    id: 1,
    name: 'Aditya Amol Patil',
    role: 'Founder & Community Lead',
    image: 'https://res.cloudinary.com/dsj0vaews/image/upload/v1766696323/aigt0lwwyqjlaso6bw7m.jpg',
    category: 'Founder',
    socials: {
      github: 'https://github.com/aditya948351',
      linkedin: 'https://www.linkedin.com/in/aditya-patil-a7743a292/',
      instagram: 'https://www.instagram.com/',
    },
  },

  // Core Leadership
  {
    id: 2,
    name: 'Sakshi Rote',
    role: 'Operations Lead (COO)',
    category: 'Core Leadership',
  },
  {
    id: 3,
    name: 'Application Pending',
    role: 'Community & Inclusion Lead',
    category: 'Core Leadership',
  },
  {
    id: 4,
    name: 'Application Pending',
    role: 'Women in Tech Lead',
    category: 'Core Leadership',
  },
  {
    id: 5,
    name: 'Application Pending',
    role: 'Technology Lead (Discord Head)',
    category: 'Core Leadership',
  },
  {
    id: 6,
    name: 'Application Pending',
    role: 'Learning & Programs Lead',
    category: 'Core Leadership',
  },
  {
    id: 7,
    name: 'Pranav Khaire',
    role: 'Marketing & Brand Lead',
    image: 'https://res.cloudinary.com/dsj0vaews/image/upload/v1766696375/eh9qepgconelmzwmdjpc.jpg',
    category: 'Core Leadership',
  },
  {
    id: 8,
    name: 'Deb Mukherjee',
    role: 'Partnerships & Outreach Lead',
    image: 'https://res.cloudinary.com/dsj0vaews/image/upload/v1766696374/d1yvkivbdly4at9m2uxk.jpg',
    category: 'Core Leadership',
  },
  {
    id: 9,
    name: 'Application Pending',
    role: 'Growth & Analytics Lead',
    category: 'Core Leadership',
  },
  {
    id: 10,
    name: 'Application Pending',
    role: 'City Leads (Network Head)',
    category: 'Core Leadership',
  },

  // Technical Leads
  {
    id: 11,
    name: 'Varun Mulay',
    role: 'Technical Lead',
    subRole: 'AIML',
    image: getPlaceholder('Varun Mulay'),
    category: 'Technical Lead',
  },
  {
    id: 12,
    name: 'Application Pending',
    role: 'Technical Lead',
    category: 'Technical Lead',
  },

  // City Leads
  {
    id: 13,
    name: 'Amitosh Biswas',
    role: 'City Lead',
    subRole: 'Bangalore',
    image: getPlaceholder('Amitosh Biswas'),
    category: 'City Lead',
  },
  {
    id: 14,
    name: 'Aditya Patil',
    role: 'City Lead',
    subRole: 'Pune',
    image: 'https://res.cloudinary.com/dsj0vaews/image/upload/v1766696323/aigt0lwwyqjlaso6bw7m.jpg',
    category: 'City Lead',
    socials: {
      linkedin: 'https://www.linkedin.com/in/aditya-patil-a7743a292/',
      instagram: 'https://www.instagram.com/',
    },
  },
  {
    id: 15,
    name: 'Prince',
    role: 'City Lead',
    subRole: 'Nagpur',
    image: getPlaceholder('Prince'),
    category: 'City Lead',
  },
  {
    id: 16,
    name: 'Deb Mukherjee',
    role: 'City Lead',
    subRole: 'Kolkata',
    image: 'https://res.cloudinary.com/dsj0vaews/image/upload/v1766696374/d1yvkivbdly4at9m2uxk.jpg',
    category: 'City Lead',
  },
  {
    id: 17,
    name: 'Application Pending',
    role: 'City Lead',
    subRole: 'Mumbai',
    category: 'City Lead',
  },
  {
    id: 18,
    name: 'Application Pending',
    role: 'City Lead',
    subRole: 'Hyderabad',
    category: 'City Lead',
  },
  {
    id: 19,
    name: 'Application Pending',
    role: 'City Lead',
    subRole: 'New Delhi',
    category: 'City Lead',
  },
  ...[
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Kerala',
    'Madhya Pradesh',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
  ].map((state, index) => ({
    id: 20 + index,
    name: 'Application Pending',
    role: 'City Lead',
    subRole: state,
    category: 'City Lead' as const,
  })),
];
