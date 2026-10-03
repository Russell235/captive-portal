import { Activity, BarChart3, Bell, FileText, Network, Server, Shield, Users, Wifi } from "lucide-react";

export const students = [
  { id: 'STU001', name: 'Eleanor Vance', matricule: '2023-0142', major: 'Computer Science', year: 'Senior', status: 'Active', gpa: 3.8, avatar: 'EV' },
  { id: 'STU002', name: 'Marcus Sterling', matricule: '2022-0891', major: 'Electrical Engineering', year: 'Junior', status: 'Active', gpa: 3.5, avatar: 'MS' },
  { id: 'STU003', name: 'Sarah Chen', matricule: '2024-1102', major: 'Business Administration', year: 'Freshman', status: 'Active', gpa: 4.0, avatar: 'SC' },
  { id: 'STU004', name: 'James Wilson', matricule: '2021-0334', major: 'Mechanical Engineering', year: 'Senior', status: 'Inactive', gpa: 3.2, avatar: 'JW' },
  { id: 'STU005', name: 'Aisha Patel', matricule: '2023-0556', major: 'Software Engineering', year: 'Sophomore', status: 'Active', gpa: 3.9, avatar: 'AP' },
  { id: 'STU006', name: 'David Kim', matricule: '2022-0778', major: 'Data Science', year: 'Junior', status: 'Active', gpa: 3.7, avatar: 'DK' },
  { id: 'STU007', name: 'Olivia Martinez', matricule: '2024-0990', major: 'Architecture', year: 'Freshman', status: 'Active', gpa: 3.6, avatar: 'OM' },
  { id: 'STU008', name: 'William Taylor', matricule: '2021-0112', major: 'Physics', year: 'Senior', status: 'Suspended', gpa: 2.8, avatar: 'WT' },
  { id: 'STU009', name: 'Sophia Anderson', matricule: '2023-0334', major: 'Mathematics', year: 'Sophomore', status: 'Active', gpa: 3.9, avatar: 'SA' },
  { id: 'STU010', name: 'Lucas Thompson', matricule: '2022-0556', major: 'Computer Science', year: 'Junior', status: 'Active', gpa: 3.4, avatar: 'LT' },
  { id: 'STU011', name: 'Isabella Garcia', matricule: '2024-0778', major: 'Biology', year: 'Freshman', status: 'Active', gpa: 3.8, avatar: 'IG' },
  { id: 'STU012', name: 'Mason Robinson', matricule: '2021-0990', major: 'Chemistry', year: 'Senior', status: 'Active', gpa: 3.5, avatar: 'MR' },
  { id: 'STU013', name: 'Mia Clark', matricule: '2023-0112', major: 'Psychology', year: 'Sophomore', status: 'Active', gpa: 3.7, avatar: 'MC' },
  { id: 'STU014', name: 'Ethan Lewis', matricule: '2022-0334', major: 'Economics', year: 'Junior', status: 'Inactive', gpa: 3.1, avatar: 'EL' },
  { id: 'STU015', name: 'Amelia Walker', matricule: '2024-0556', major: 'Political Science', year: 'Freshman', status: 'Active', gpa: 3.9, avatar: 'AW' },
];

export const activeSessions = [
  { id: 'SES001', student: 'Eleanor Vance', ip: '192.168.1.42', mac: '00:1B:44:11:3A:B7', location: 'Library Main', duration: '2h 15m', bandwidth: '1.2 GB', device: 'MacBook Pro' },
  { id: 'SES002', student: 'Marcus Sterling', ip: '192.168.2.15', mac: '00:1B:44:11:3A:B8', location: 'Engineering Block', duration: '4h 30m', bandwidth: '3.5 GB', device: 'Dell XPS' },
  { id: 'SES003', student: 'Sarah Chen', ip: '192.168.1.88', mac: '00:1B:44:11:3A:B9', location: 'Student Union', duration: '45m', bandwidth: '450 MB', device: 'iPhone 13' },
  { id: 'SES004', student: 'Aisha Patel', ip: '192.168.3.22', mac: '00:1B:44:11:3A:C0', location: 'Dormitory A', duration: '1h 20m', bandwidth: '800 MB', device: 'iPad Pro' },
  { id: 'SES005', student: 'David Kim', ip: '192.168.2.105', mac: '00:1B:44:11:3A:C1', location: 'Computer Lab 3', duration: '3h 10m', bandwidth: '5.1 GB', device: 'ThinkPad T14' },
  { id: 'SES006', student: 'Olivia Martinez', ip: '192.168.4.55', mac: '00:1B:44:11:3A:C2', location: 'Architecture Studio', duration: '5h 05m', bandwidth: '2.8 GB', device: 'MacBook Air' },
  { id: 'SES007', student: 'Sophia Anderson', ip: '192.168.1.112', mac: '00:1B:44:11:3A:C3', location: 'Library East Wing', duration: '15m', bandwidth: '120 MB', device: 'Galaxy S22' },
  { id: 'SES008', student: 'Lucas Thompson', ip: '192.168.3.89', mac: '00:1B:44:11:3A:C4', location: 'Dormitory B', duration: '8h 45m', bandwidth: '12.4 GB', device: 'Custom PC' },
  { id: 'SES009', student: 'Isabella Garcia', ip: '192.168.5.34', mac: '00:1B:44:11:3A:C5', location: 'Science Building', duration: '2h 40m', bandwidth: '1.5 GB', device: 'Surface Pro' },
  { id: 'SES010', student: 'Mason Robinson', ip: '192.168.2.210', mac: '00:1B:44:11:3A:C6', location: 'Chemistry Lab', duration: '1h 55m', bandwidth: '950 MB', device: 'MacBook Pro' },
];

export const networkDevices = [
  { id: 'DEV001', name: 'Core Router Alpha', type: 'Router', ip: '10.0.0.1', status: 'Online', uptime: '45d 12h', clients: 1250 },
  { id: 'DEV002', name: 'Library Switch Main', type: 'Switch', ip: '10.0.1.1', status: 'Online', uptime: '12d 4h', clients: 342 },
  { id: 'DEV003', name: 'AP-Lib-Floor1', type: 'Access Point', ip: '10.0.1.15', status: 'Online', uptime: '8d 2h', clients: 45 },
  { id: 'DEV004', name: 'AP-Lib-Floor2', type: 'Access Point', ip: '10.0.1.16', status: 'Warning', uptime: '1d 5h', clients: 82 },
  { id: 'DEV005', name: 'Eng Switch Dist', type: 'Switch', ip: '10.0.2.1', status: 'Online', uptime: '145d 1h', clients: 412 },
  { id: 'DEV006', name: 'AP-Eng-Lab3', type: 'Access Point', ip: '10.0.2.22', status: 'Offline', uptime: '0m', clients: 0 },
  { id: 'DEV007', name: 'Dorm Switch Core', type: 'Switch', ip: '10.0.3.1', status: 'Online', uptime: '67d 8h', clients: 856 },
  { id: 'DEV008', name: 'AP-DormA-Lobby', type: 'Access Point', ip: '10.0.3.45', status: 'Online', uptime: '22d 11h', clients: 34 },
];

export const notifications = [
  { id: 'NOT001', title: 'System Maintenance', message: 'CampusNet will undergo scheduled maintenance this Sunday from 2 AM to 4 AM.', date: '2024-05-15T10:00:00Z', read: false, type: 'system' },
  { id: 'NOT002', title: 'New Document Available', message: 'The Fall 2024 Academic Calendar has been published.', date: '2024-05-14T14:30:00Z', read: true, type: 'academic' },
  { id: 'NOT003', title: 'Bandwidth Warning', message: 'You have used 80% of your weekly high-speed bandwidth allocation.', date: '2024-05-13T09:15:00Z', read: false, type: 'alert' },
  { id: 'NOT004', title: 'Library Hours Extended', message: 'Main library will be open 24/7 during finals week.', date: '2024-05-12T11:45:00Z', read: true, type: 'campus' },
  { id: 'NOT005', title: 'Wi-Fi Certificate Update', message: 'Please update your eduroam certificate to maintain connection.', date: '2024-05-10T16:20:00Z', read: true, type: 'system' },
  { id: 'NOT006', title: 'Tuition Deadline', message: 'Reminder: Fall 2024 tuition payment is due by August 1st.', date: '2024-05-09T08:00:00Z', read: true, type: 'academic' },
  { id: 'NOT007', title: 'Support Ticket Updated', message: 'Your ticket #TKT102 has been resolved.', date: '2024-05-08T13:10:00Z', read: true, type: 'support' },
  { id: 'NOT008', title: 'Campus Event', message: 'Join the annual Tech Fair this Friday at the Student Union.', date: '2024-05-07T15:00:00Z', read: true, type: 'campus' },
];

export const tickets = [
  { id: 'TKT001', subject: 'Cannot connect to Eduroam in Dorm B', student: 'Lucas Thompson', status: 'Open', priority: 'High', date: '2024-05-15T09:30:00Z', category: 'Network' },
  { id: 'TKT002', subject: 'Forgot portal password', student: 'Sarah Chen', status: 'Resolved', priority: 'Medium', date: '2024-05-14T11:15:00Z', category: 'Account' },
  { id: 'TKT003', subject: 'Access denied to academic journals', student: 'Eleanor Vance', status: 'In Progress', priority: 'Medium', date: '2024-05-13T14:45:00Z', category: 'Resources' },
  { id: 'TKT004', subject: 'Printer connection failing in Library', student: 'David Kim', status: 'Open', priority: 'Low', date: '2024-05-15T16:20:00Z', category: 'Hardware' },
  { id: 'TKT005', subject: 'Timetable not syncing', student: 'Olivia Martinez', status: 'Resolved', priority: 'High', date: '2024-05-10T10:00:00Z', category: 'Software' },
  { id: 'TKT006', subject: 'Requesting guest Wi-Fi access', student: 'James Wilson', status: 'Closed', priority: 'Low', date: '2024-05-05T08:30:00Z', category: 'Network' },
];

export const timetable = [
  { id: 'CLS001', course: 'CS 301 - Data Structures', professor: 'Dr. Alan Turing', room: 'Eng 101', day: 'Monday', start: '09:00', end: '10:30', color: 'bg-blue-500' },
  { id: 'CLS002', course: 'MATH 205 - Linear Algebra', professor: 'Dr. John Nash', room: 'Sci 204', day: 'Monday', start: '11:00', end: '12:30', color: 'bg-indigo-500' },
  { id: 'CLS003', course: 'PHY 101 - Intro to Physics', professor: 'Dr. Marie Curie', room: 'Lab 3', day: 'Tuesday', start: '10:00', end: '12:00', color: 'bg-purple-500' },
  { id: 'CLS004', course: 'CS 301 - Data Structures (Lab)', professor: 'TA. Grace Hopper', room: 'Comp Lab 1', day: 'Wednesday', start: '14:00', end: '16:00', color: 'bg-blue-500' },
  { id: 'CLS005', course: 'ENG 110 - Academic Writing', professor: 'Prof. J.R.R. Tolkien', room: 'Arts 302', day: 'Thursday', start: '09:30', end: '11:00', color: 'bg-pink-500' },
  { id: 'CLS006', course: 'MATH 205 - Linear Algebra', professor: 'Dr. John Nash', room: 'Sci 204', day: 'Friday', start: '11:00', end: '12:30', color: 'bg-indigo-500' },
];

export const announcements = [
  { id: 'ANN001', title: 'Summer Internship Fair 2024', date: 'May 15, 2024', author: 'Career Services', excerpt: 'Meet with over 50 top tech companies looking for summer interns.', status: 'Published' },
  { id: 'ANN002', title: 'New Library Booking System', date: 'May 12, 2024', author: 'Library Admin', excerpt: 'We are launching a new system for booking study rooms in the main library.', status: 'Published' },
  { id: 'ANN003', title: 'Campus Hackathon Registration Open', date: 'May 10, 2024', author: 'CS Department', excerpt: 'Register now for the annual 48-hour CampusHack event. Prizes up to $5,000.', status: 'Published' },
  { id: 'ANN004', title: 'End of Semester Policy Changes', date: 'May 08, 2024', author: 'Academic Dean', excerpt: 'Please review the updated policies regarding final exam schedules and grading.', status: 'Draft' },
];

export const documents = [
  { id: 'DOC001', name: 'Student_Handbook_2024.pdf', size: '2.4 MB', date: '2024-01-10', category: 'Official', type: 'pdf' },
  { id: 'DOC002', name: 'Academic_Calendar_Fall24.pdf', size: '1.1 MB', date: '2024-03-15', category: 'Academic', type: 'pdf' },
  { id: 'DOC003', name: 'Campus_Map_HighRes.png', size: '5.8 MB', date: '2023-08-20', category: 'Resources', type: 'image' },
  { id: 'DOC004', name: 'Financial_Aid_Form_A.docx', size: '450 KB', date: '2024-02-05', category: 'Finance', type: 'doc' },
  { id: 'DOC005', name: 'Lab_Safety_Guidelines.pdf', size: '890 KB', date: '2023-09-01', category: 'Academic', type: 'pdf' },
];

export const chartData = {
  bandwidth: [
    { time: '00:00', usage: 120 },
    { time: '04:00', usage: 45 },
    { time: '08:00', usage: 350 },
    { time: '12:00', usage: 890 },
    { time: '16:00', usage: 720 },
    { time: '20:00', usage: 950 },
    { time: '23:59', usage: 420 },
  ],
  devices: [
    { name: 'Laptops', value: 4500, color: '#4f46e5' },
    { name: 'Smartphones', value: 6200, color: '#8b5cf6' },
    { name: 'Tablets', value: 1200, color: '#ec4899' },
    { name: 'IoT/Other', value: 850, color: '#6366f1' },
  ],
  weeklyUsers: [
    { day: 'Mon', students: 4200, staff: 850 },
    { day: 'Tue', students: 4800, staff: 900 },
    { day: 'Wed', students: 5100, staff: 880 },
    { day: 'Thu', students: 4900, staff: 890 },
    { day: 'Fri', students: 3800, staff: 820 },
    { day: 'Sat', students: 1200, staff: 150 },
    { day: 'Sun', students: 1800, staff: 180 },
  ]
};

// Admin accounts
export const administrators = [
  { id: 'ADM001', name: 'Dr. Robert Chen', email: 'r.chen@university.edu', role: 'Super Admin', department: 'IT Operations', status: 'Active', lastLogin: '2024-05-15T08:30:00Z', avatar: 'RC' },
  { id: 'ADM002', name: 'Sarah Mitchell', email: 's.mitchell@university.edu', role: 'Network Admin', department: 'IT Operations', status: 'Active', lastLogin: '2024-05-14T16:20:00Z', avatar: 'SM' },
  { id: 'ADM003', name: 'James Park', email: 'j.park@university.edu', role: 'Support Manager', department: 'Student Services', status: 'Active', lastLogin: '2024-05-13T10:45:00Z', avatar: 'JP' },
  { id: 'ADM004', name: 'Linda Torres', email: 'l.torres@university.edu', role: 'Content Manager', department: 'Academic Affairs', status: 'Inactive', lastLogin: '2024-04-28T14:00:00Z', avatar: 'LT' },
];

// Activity logs
export const activityLogs = [
  { id: 'LOG001', action: 'Student login', user: 'Eleanor Vance', ip: '192.168.1.42', timestamp: '2024-05-15T14:30:00Z', status: 'success', category: 'auth' },
  { id: 'LOG002', action: 'Failed login attempt', user: 'unknown', ip: '192.168.5.99', timestamp: '2024-05-15T14:28:00Z', status: 'warning', category: 'security' },
  { id: 'LOG003', action: 'Session terminated', user: 'Admin: James Park', ip: '10.0.0.5', timestamp: '2024-05-15T14:25:00Z', status: 'info', category: 'admin' },
  { id: 'LOG004', action: 'Document uploaded', user: 'Linda Torres', ip: '10.0.0.8', timestamp: '2024-05-15T14:20:00Z', status: 'success', category: 'content' },
  { id: 'LOG005', action: 'Bandwidth limit exceeded', user: 'Lucas Thompson', ip: '192.168.3.89', timestamp: '2024-05-15T14:15:00Z', status: 'warning', category: 'network' },
  { id: 'LOG006', action: 'System config changed', user: 'Admin: Dr. Robert Chen', ip: '10.0.0.2', timestamp: '2024-05-15T13:55:00Z', status: 'info', category: 'system' },
  { id: 'LOG007', action: 'New ticket opened', user: 'David Kim', ip: '192.168.2.105', timestamp: '2024-05-15T13:40:00Z', status: 'info', category: 'support' },
  { id: 'LOG008', action: 'Device went offline', user: 'System', ip: '10.0.2.22', timestamp: '2024-05-15T13:20:00Z', status: 'error', category: 'network' },
  { id: 'LOG009', action: 'Announcement published', user: 'Admin: Sarah Mitchell', ip: '10.0.0.6', timestamp: '2024-05-15T12:50:00Z', status: 'success', category: 'content' },
  { id: 'LOG010', action: 'Password reset', user: 'Sarah Chen', ip: '192.168.1.88', timestamp: '2024-05-15T11:30:00Z', status: 'success', category: 'auth' },
  { id: 'LOG011', action: 'Report generated', user: 'Admin: Dr. Robert Chen', ip: '10.0.0.2', timestamp: '2024-05-15T10:45:00Z', status: 'success', category: 'system' },
  { id: 'LOG012', action: 'Unauthorized access attempt', user: 'unknown', ip: '203.0.113.42', timestamp: '2024-05-15T09:12:00Z', status: 'error', category: 'security' },
];

// FAQ items
export const faqItems = [
  { id: 'FAQ001', question: 'How do I connect to the campus Wi-Fi?', answer: 'Open your device Wi-Fi settings, select "Eduroam", and enter your university email and portal password. On first connection, accept the security certificate.', category: 'Connection' },
  { id: 'FAQ002', question: 'What is my bandwidth limit?', answer: 'Standard students receive 50 GB of high-speed data per month. After this, speeds are reduced to 5 Mbps for browsing. Research students receive unlimited bandwidth.', category: 'Network' },
  { id: 'FAQ003', question: 'How do I reset my portal password?', answer: 'Click "Forgot Password" on the login page and follow the instructions sent to your university email. If you cannot access your email, visit the IT Help Desk in the Admin Building.', category: 'Account' },
  { id: 'FAQ004', question: 'Why am I being disconnected repeatedly?', answer: 'This is often caused by an expired eduroam certificate. Go to Settings > Network > Update Certificate, or download the latest configuration from the Documents section.', category: 'Connection' },
  { id: 'FAQ005', question: 'Can I connect multiple devices?', answer: 'Yes, you can connect up to 5 devices simultaneously with your student credentials. Each device session is tracked separately in your portal dashboard.', category: 'Connection' },
  { id: 'FAQ006', question: 'How do I access academic journals off-campus?', answer: 'Use the campus VPN to access the full library resources from anywhere. Download the VPN client from the Documents section and log in with your student credentials.', category: 'Resources' },
  { id: 'FAQ007', question: 'How do I submit a support ticket?', answer: 'Navigate to Support in the student menu, fill in the subject and description of your issue, select a category, and click Submit. You will receive email updates as your ticket is processed.', category: 'Support' },
  { id: 'FAQ008', question: 'What devices are supported?', answer: 'CampusNet supports all modern devices including Windows 10+, macOS 11+, iOS 14+, and Android 10+. Linux is supported via manual eduroam configuration.', category: 'Connection' },
];

export const pageMeta = {
  students: {
    title: "Students",
    description: "Manage student accounts and portal access.",
    icon: Users,
  },
  sessions: {
    title: "Active Sessions",
    description: "Monitor live network connections and bandwidth.",
    icon: Wifi,
  },
  devices: {
    title: "Network Devices",
    description: "Keep infrastructure healthy across campus.",
    icon: Server,
  },
  timetable: {
    title: "Timetable Management",
    description: "Configure academic schedules for the university.",
    icon: Network,
  },
  announcements: {
    title: "Announcements",
    description: "Publish campus-wide alerts and updates.",
    icon: Bell,
  },
  documents: {
    title: "Document Center",
    description: "Upload, organize, and control access to university files.",
    icon: FileText,
  },
  tickets: {
    title: "Support Tickets",
    description: "Resolve student IT requests from one queue.",
    icon: Activity,
  },
  administrators: {
    title: "Administrators",
    description: "Manage IT staff roles and permissions.",
    icon: Shield,
  },
  reports: {
    title: "Analytics & Reports",
    description: "Understand portal usage and network performance.",
    icon: BarChart3,
  },
  logs: {
    title: "Activity Logs",
    description: "Review audit trails for security and troubleshooting.",
    icon: Activity,
  },
  settings: {
    title: "System Settings",
    description: "Configure global portal rules, security, and branding.",
    icon: Shield,
  },
};

export function tone(value) {
  const normalized = value.toLowerCase();
  if (
    ["active", "online", "published", "resolved", "success"].includes(
      normalized,
    )
  )
    return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (["warning", "draft", "medium", "in progress"].includes(normalized))
    return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  if (["high", "error", "suspended", "offline"].includes(normalized))
    return "bg-rose-500/10 text-rose-600 border-rose-500/20";
  if (["info", "open", "network admin"].includes(normalized))
    return "bg-sky-500/10 text-sky-600 border-sky-500/20";
  return "bg-muted text-muted-foreground border-border/60";
}