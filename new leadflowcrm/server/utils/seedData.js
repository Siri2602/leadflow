const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: '../.env' });

const User = require('../models/User');
const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Lead.deleteMany({});
  await Activity.deleteMany({});

  const admin = await User.create({ name: 'Admin User', email: 'admin@leadflow.com', password: 'admin123', role: 'admin' });
  const bda1 = await User.create({ name: 'Rahul Sharma', email: 'rahul@leadflow.com', password: 'bda123', role: 'bda' });
  const bda2 = await User.create({ name: 'Priya Patel', email: 'priya@leadflow.com', password: 'bda123', role: 'bda' });
  const bda3 = await User.create({ name: 'Arjun Singh', email: 'arjun@leadflow.com', password: 'bda123', role: 'bda' });

  const statuses = ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const sources = ['Website', 'Referral', 'Cold Call', 'Email Campaign', 'LinkedIn', 'Trade Show'];
  const employees = [bda1._id, bda2._id, bda3._id];

  const leads = [];
  const companies = [
    { client: 'Raj Kumar', company: 'TechPro Solutions' },
    { client: 'Sunita Rao', company: 'GlobalMfg Co.' },
    { client: 'Vikram Mehta', company: 'IndustrialPlus' },
    { client: 'Anjali Nair', company: 'SmartFactory Ltd' },
    { client: 'Deepak Gupta', company: 'ProManufacture' },
    { client: 'Ritu Joshi', company: 'ModernTools Inc' },
    { client: 'Karthik Iyer', company: 'AutoParts Corp' },
    { client: 'Meena Verma', company: 'SteelWorks Ltd' },
    { client: 'Sanjay Das', company: 'PrecisionMach' },
    { client: 'Kavita Singh', company: 'FutureEngg Co' },
    { client: 'Anil Mishra', company: 'HeavyDuty Industries' },
    { client: 'Pooja Tiwari', company: 'NanoTech Mfg' },
    { client: 'Rohit Bansal', company: 'MetalCraft Ltd' },
    { client: 'Seema Kapoor', company: 'QualiProd Corp' },
    { client: 'Manoj Kumar', company: 'Apex Manufacturing' },
  ];

  for (let i = 0; i < companies.length; i++) {
    const followUp = new Date();
    followUp.setDate(followUp.getDate() + Math.floor(Math.random() * 14) - 3);
    leads.push({
      clientName: companies[i].client,
      companyName: companies[i].company,
      email: `${companies[i].client.toLowerCase().replace(' ', '.')}@${companies[i].company.toLowerCase().replace(/\s/g, '')}.com`,
      phone: `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`,
      source: sources[i % sources.length],
      status: statuses[i % statuses.length],
      assignedTo: employees[i % employees.length],
      followUpDate: followUp,
      notes: `Lead from ${sources[i % sources.length]}. Priority follow-up required.`,
      value: Math.floor(50000 + Math.random() * 950000),
      priority: ['Low', 'Medium', 'High'][i % 3],
    });
  }

  await Lead.insertMany(leads);
  console.log('✅ Seed data inserted!');
  console.log('Admin: admin@leadflow.com / admin123');
  console.log('BDA: rahul@leadflow.com / bda123');
  process.exit();
};

seed().catch(console.error);
