const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load models
const User = require('./models/User');
const Category = require('./models/Category');
const Ticket = require('./models/Ticket');
const Comment = require('./models/Comment');
const FileAttachment = require('./models/FileAttachment');

dotenv.config(); // Load environment variables

// Sample Data
const sampleUsers = [
  { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin', status: 'active' },
  { name: 'Staff User 1', email: 'staff1@example.com', password: 'password123', role: 'staff', status: 'active' },
  { name: 'Staff User 2', email: 'staff2@example.com', password: 'password123', role: 'staff', status: 'active' },
  { name: 'Customer User 1', email: 'customer1@example.com', password: 'password123', role: 'customer', status: 'active' },
  { name: 'Customer User 2', email: 'customer2@example.com', password: 'password123', role: 'customer', status: 'active' },
  { name: 'Customer User 3', email: 'customer3@example.com', password: 'password123', role: 'customer', status: 'active' },
   { name: 'Customer User 4', email: 'customer4@example.com', password: 'password123', role: 'customer', status: 'active' },
   { name: 'Customer User 5', email: 'customer5@example.com', password: 'password123', role: 'customer', status: 'active' },
   { name: 'Customer User 6', email: 'customer6@example.com', password: 'password123', role: 'customer', status: 'active' },
   { name: 'Inactive User', email: 'inactive@example.com', password: 'password123', role: 'customer', status: 'inactive' },
];

const sampleCategories = [
  { categoryName: 'Technical Support', description: 'Issues related to software or hardware functionality' },
  { categoryName: 'Billing Inquiry', description: 'Questions or problems with invoices and payments' },
  { categoryName: 'Feature Request', description: 'Suggestions for new features or improvements' },
  { categoryName: 'General Question', description: 'Any other general inquiries' },
];

// Tickets, Comments, and FileAttachments will be created dynamically after users and categories

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data (optional)
    console.log('Clearing existing data...');
    await User.deleteMany();
    await Category.deleteMany();
    await Ticket.deleteMany();
    await Comment.deleteMany();
    await FileAttachment.deleteMany();
    console.log('Existing data cleared.');

    // Insert Users
    console.log('Inserting sample users...');
    const createdUsers = await User.insertMany(sampleUsers);
    const adminUser = createdUsers.find(user => user.role === 'admin');
    const staffUsers = createdUsers.filter(user => user.role === 'staff');
    const customerUsers = createdUsers.filter(user => user.role === 'customer');
    console.log(`${createdUsers.length} users inserted.`);

    // Log found users to check if they are undefined
    console.log('Found Admin User:', adminUser);
    console.log('Found Staff Users (', staffUsers.length, '):', staffUsers.map(u => u.email));
    console.log('Found Customer Users (', customerUsers.length, '):', customerUsers.map(u => u.email));

    // Insert Categories
    console.log('Inserting sample categories...');
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log(`${createdCategories.length} categories inserted.`);

     // Log found categories to check if they are undefined
    console.log('Created Categories (', createdCategories.length, '):', createdCategories.map(c => c.categoryName));


    // Insert Tickets (linking to users and categories)
    console.log('Inserting sample tickets...');
    const sampleTickets = [
        {
            subject: 'Cannot log in to the system',
            description: 'I am unable to access my account after changing my password.',
            status: 'open',
            priority: 'high',
            customer: customerUsers[0]._id,
            category: createdCategories.find(cat => cat.categoryName === 'Technical Support')._id,
        },
         {
            subject: 'Question about my last invoice',
            description: 'My last invoice amount seems incorrect. Could you please review it?',
            status: 'open',
            priority: 'medium',
            customer: customerUsers[1]._id,
            category: createdCategories.find(cat => cat.categoryName === 'Billing Inquiry')._id,
            assignedTo: staffUsers[0] ? staffUsers[0]._id : adminUser._id, // Assign to staff 1 if exists, else admin
        },
        {
            subject: 'Request for new reporting feature',
            description: 'It would be great to have more detailed reports on user activity.',
            status: 'in progress',
            priority: 'low',
            customer: customerUsers[2]._id,
            category: createdCategories.find(cat => cat.categoryName === 'Feature Request')._id,
            assignedTo: staffUsers[1] ? staffUsers[1]._id : adminUser.id, // Assign to staff 2 if exists, else admin
        },
         {
            subject: 'General question about service tiers',
            description: 'Could you explain the difference between your standard and premium service tiers?',
            status: 'closed',
            priority: 'low',
            customer: customerUsers[3]._id,
            category: createdCategories.find(cat => cat.categoryName === 'General Question')._id,
            assignedTo: adminUser ? adminUser._id : null, // Assign to admin if exists
        },
         {
            subject: 'Issue with file upload',
            description: 'When trying to upload documents, I encounter an error.',
            status: 'open',
            priority: 'high',
            customer: customerUsers[4]._id,
            category: createdCategories.find(cat => cat.categoryName === 'Technical Support')._id,
        },
         {
            subject: 'Discount query',
            description: 'Are there any available discounts for long-term customers?',
            status: 'in progress',
            priority: 'medium',
            customer: customerUsers[5]._id,
            category: createdCategories.find(cat => cat.categoryName === 'Billing Inquiry')._id,
            assignedTo: staffUsers[0] ? staffUsers[0]._id : adminUser._id,
        },
         {
            subject: 'Integration request',
            description: 'We would like to request an integration with our existing CRM software.',
            status: 'open',
            priority: 'medium',
            customer: customerUsers[0]._id,
            category: createdCategories.find(cat => cat.categoryName === 'Feature Request')._id,
        },
        {
            subject: 'Account activation problem',
            description: 'My account is showing as inactive, but I should have access.',
            status: 'open',
            priority: 'high',
            customer: customerUsers[6]._id,
            category: createdCategories.find(cat => cat.categoryName === 'Technical Support')._id,
        },
         {
            subject: 'Subscription renewal issue',
            description: 'I am having trouble renewing my annual subscription.',
            status: 'in progress',
            priority: 'high',
            customer: customerUsers[0]._id, // Reuse customer 1
            category: createdCategories.find(cat => cat.categoryName === 'Billing Inquiry')._id,
            assignedTo: staffUsers[1] ? staffUsers[1]._id : adminUser._id,
        },
         {
            subject: 'Improve user interface',
            description: 'The current user interface feels a bit outdated. Could it be modernized?',
            status: 'open',
            priority: 'low',
            customer: customerUsers[1]._id, // Reuse customer 2
            category: createdCategories.find(cat => cat.categoryName === 'Feature Request')._id,
        },
         {
            subject: 'Broken link on website',
            description: 'I found a broken link on the contact us page.',
            status: 'closed',
            priority: 'low',
            customer: customerUsers[2]._id, // Reuse customer 3
            category: createdCategories.find(cat => cat.categoryName === 'General Question')._id,
        },
    ];

    // Ensure required users/categories were found before creating tickets
    if (!adminUser || staffUsers.length < 2 || customerUsers.length < 7 || createdCategories.length < 4) { // Check for 7 customer users
        console.error('Error: Not enough users or categories found to create sample tickets.');
        console.error('Admin User found:', !!adminUser);
        console.error('Staff Users found:', staffUsers.length);
        console.error('Customer Users found:', customerUsers.length);
        console.error('Categories found:', createdCategories.length);
        process.exit(1);
    }

    const createdTickets = await Ticket.insertMany(sampleTickets);
    console.log(`${createdTickets.length} tickets inserted.`);

    // Insert Comments (linking to users and tickets)
    console.log('Inserting sample comments...');
    const sampleComments = [
        { content: 'Thank you for reporting this. We are looking into it.', author: staffUsers[0] ? staffUsers[0]._id : adminUser._id, ticket: createdTickets[0]._id }, // Staff/Admin comment on ticket 1
        { content: 'Any updates on this issue?', author: customerUsers[0]._id, ticket: createdTickets[0]._id }, // Customer comment on ticket 1
        { content: 'We have received your request and are reviewing your invoice.', author: staffUsers[0] ? staffUsers[0]._id : adminUser._id, ticket: createdTickets[1]._id }, // Staff/Admin comment on ticket 2
         { content: 'I have added this to our feature request backlog.', author: staffUsers[1] ? staffUsers[1]._id : adminUser._id, ticket: createdTickets[2]._id }, // Staff/Admin comment on ticket 3
          { content: 'I am still having trouble accessing my account.', author: customerUsers[4]._id, ticket: createdTickets[4]._id }, // Customer comment on ticket 5
           { content: 'Please provide more details about the error you are seeing.', author: staffUsers[0] ? staffUsers[0]._id : adminUser._id, ticket: createdTickets[4]._id }, // Staff/Admin comment on ticket 5
    ];
    const createdComments = await Comment.insertMany(sampleComments);
    console.log(`${createdComments.length} comments inserted.`);

    // Link comments to tickets (Mongoose might handle this if using push, but doing explicitly here)
    for (const comment of createdComments) {
        await Ticket.findByIdAndUpdate(
            comment.ticket,
            { $push: { comments: comment._id } },
            { new: true }
        );
    }
    console.log('Comments linked to tickets.');

    // Insert File Attachments (linking to tickets)
     console.log('Inserting sample file attachments...');
     const sampleFileAttachments = [
         { fileName: 'screenshot1.png', link: 'https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/screenshot1.png', public_id: 'screenshot1', ticket: createdTickets[0]._id }, // Attachment for ticket 1
          { fileName: 'invoice_details.pdf', link: 'https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/invoice_details.pdf', public_id: 'invoice_details', ticket: createdTickets[1]._id }, // Attachment for ticket 2
           { fileName: 'log_file.txt', link: 'https://res.cloudinary.com/your_cloud_name/raw/upload/v1234567890/log_file.txt', public_id: 'log_file', ticket: createdTickets[4]._id }, // Attachment for ticket 5
     ];

     // Ensure required tickets exist before creating attachments
      if (createdTickets.length < 5) { // Need at least 5 tickets for sample attachments
        console.error('Error: Not enough tickets created to link sample file attachments.');
        process.exit(1);
      }

     const createdFileAttachments = await FileAttachment.insertMany(sampleFileAttachments);
     console.log(`${createdFileAttachments.length} file attachments inserted.`);

     // Link file attachments to tickets
    for (const attachment of createdFileAttachments) {
        await Ticket.findByIdAndUpdate(
            attachment.ticket,
            { $push: { fileAttachments: attachment._id } },
            { new: true }
        );
    }
     console.log('File attachments linked to tickets.');

    console.log('Database Seeding Complete!');
    process.exit(0);

  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase(); 