export interface TeamMember {
    id: number;
    name: string;
    image: string;
}

// Get basePath for production deployment
const basePath = process.env.NODE_ENV === 'production' ? '/DevPath' : '';

export const teamMembers: TeamMember[] = [
    { id: 1, name: "Colin", image: `${basePath}/team/member-1.jpeg` },
    { id: 2, name: "Liam", image: `${basePath}/team/member-2.jpeg` },
    { id: 3, name: "Tabitha", image: `${basePath}/team/member-3.jpeg` },
    { id: 4, name: "Tyson", image: `${basePath}/team/member-4.jpeg` },
    { id: 5, name: "Max", image: `${basePath}/team/member-5.jpeg` },
    { id: 6, name: "Everest", image: `${basePath}/team/member-6.jpeg` },
    { id: 7, name: "Simon", image: `${basePath}/team/member-7.jpeg` },
    { id: 8, name: "Gideon", image: `${basePath}/team/member-8.jpeg` },
    { id: 9, name: "Benton", image: `${basePath}/team/member-9.jpeg` },
];
