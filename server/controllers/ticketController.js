const Ticket = require('../models/Ticket');
const User = require('../models/User'); // Needed to check user role and populate
const Comment = require('../models/Comment'); // Needed to populate comments
const FileAttachment = require('../models/FileAttachment'); // Import FileAttachment model
const multer = require('multer'); // Import multer
const path = require('path'); // Import path to handle file paths
const { validationResult } = require('express-validator'); // Import validationResult
const cloudinary = require('cloudinary').v2; // Import cloudinary
const dotenv = require('dotenv'); // Import dotenv to load environment variables

dotenv.config(); // Load environment variables

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer storage (using memory storage for Cloudinary upload)
const storage = multer.memoryStorage();

// Check file type (optional, Cloudinary can handle many types)
const checkFileType = (file, cb) => {
  // You can add specific file type checks here if needed before uploading to Cloudinary
  // For now, we'll allow common file types
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|csv|xlsx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Unsupported file type!');
  }
};

// Initialize multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size (e.g., 10MB)
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single('file'); // 'file' is the field name for the uploaded file

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Customer
const createTicket = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { subject, description, category } = req.body;
  const customerId = req.user._id; // Get customer ID from authenticated user

  if (!subject || !description) {
    res.status(400).json({ message: 'Please add a subject and description' });
    return;
  }

  try {
    const ticket = await Ticket.create({
      subject,
      description,
      customer: customerId,
      category: category || null, // Category is optional
      status: 'open', // Default status
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Staff, Admin
const getTickets = async (req, res) => {
  // Only staff and admin can view all tickets
  if (req.user.role !== 'staff' && req.user.role !== 'admin') {
    res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
    return;
  }

  try {
    // Filter tickets by assignedTo for staff, allow admin to see all
    const filter = req.user.role === 'staff' ? { assignedTo: req.user._id } : {};

    const tickets = await Ticket.find(filter)
      .populate('customer', 'name email') // Populate customer details
      .populate('assignedTo', 'name email') // Populate assigned staff/admin details
      .populate('category', 'categoryName'); // Populate category details

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single ticket
// @route   GET /api/tickets/:id
// @access  Customer (if owned), Staff, Admin
const getTicketById = async (req, res) => {
  const ticketId = req.params.id;
  const userId = req.user._id;
  const userRole = req.user.role;

  try {
    const ticket = await Ticket.findById(ticketId)
      .populate('customer', 'name email')
      .populate('assignedTo', 'name email')
      .populate('category', 'categoryName')
      .populate({ // Populate comments and their authors
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name role',
        },
      })
      .populate('fileAttachments', 'fileName link'); // Populate file attachments

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    // Check if the user is authorized to view this ticket
    const isCustomerOwner = ticket.customer && ticket.customer._id && ticket.customer._id.equals(userId);
    const isStaffOrAdmin = userRole === 'staff' || userRole === 'admin';

    if (!isCustomerOwner && !isStaffOrAdmin) {
      res.status(403).json({ message: `User role ${userRole} is not authorized to view this ticket` });
      return;
    }

    console.log('Ticket object before sending response:', ticket); // Add this line
    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error); // Log the full error
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a ticket
// @route   PUT /api/tickets/:id
// @access  Staff, Admin (potentially customer for status?)
const updateTicket = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const ticketId = req.params.id;
  const userId = req.user._id;
  const userRole = req.user.role;
  const { subject, description, status, assignedTo, category } = req.body;

  try {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    // Check if the user is authorized to update this ticket
    const isCustomerOwner = ticket.customer.equals(userId);
    const isStaffOrAdmin = userRole === 'staff' || userRole === 'admin';

    // Customers can potentially update status (e.g., close), but not other fields normally
    // Staff/Admin can update most fields

    if (isCustomerOwner && (subject || description || assignedTo || category)) {
        // Customer trying to update fields they shouldn't
        res.status(403).json({ message: 'Customers can only update ticket status' });
        return;
    }

     if (!isStaffOrAdmin && !isCustomerOwner) {
       // Neither staff/admin nor the owning customer
       res.status(403).json({ message: `User role ${userRole} is not authorized to update this ticket` });
       return;
     }


    // Update fields based on role
    if (isStaffOrAdmin) {
      ticket.subject = subject || ticket.subject;
      ticket.description = description || ticket.description;
      ticket.status = status || ticket.status;
      ticket.assignedTo = assignedTo || ticket.assignedTo;
      ticket.category = category || ticket.category;
    } else if (isCustomerOwner) {
        // Customer can only update status (if you want to allow this)
        if (status) {
            ticket.status = status;
        } else if (subject || description || assignedTo || category) {
             res.status(403).json({ message: 'Customers can only update ticket status' });
             return;
        }
    }

    const updatedTicket = await ticket.save();

    // Populate the updated ticket for the response
    const populatedTicket = await Ticket.findById(updatedTicket._id)
        .populate('customer', 'name email')
        .populate('assignedTo', 'name email')
        .populate('category', 'categoryName')
         .populate({ // Populate comments and their authors
            path: 'comments',
            populate: {
              path: 'author',
              select: 'name role',
            },
          })
        .populate('fileAttachments', 'fileName link'); // Populate file attachments

    res.json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a ticket
// @route   DELETE /api/tickets/:id
// @access  Admin
const deleteTicket = async (req, res) => {
  // Only admin can delete tickets
  if (req.user.role !== 'admin') {
    res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
    return;
  }

  const ticketId = req.params.id;

  try {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    await ticket.deleteOne();

    res.json({ message: 'Ticket removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Assign a ticket to a staff/admin
// @route   PUT /api/tickets/:id/assign
// @access  Staff, Admin
const assignTicket = async (req, res) => {
   // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Only staff and admin can assign tickets
  if (req.user.role !== 'staff' && req.user.role !== 'admin') {
    res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
    return;
  }

  const ticketId = req.params.id;
  const { assignedTo } = req.body;

  if (!assignedTo) {
      res.status(400).json({ message: 'Please provide a user ID to assign the ticket to' });
      return;
  }

  try {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    // Optional: Verify if assignedTo user exists and is staff/admin
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || (assignedUser.role !== 'staff' && assignedUser.role !== 'admin')) {
        res.status(400).json({ message: 'Cannot assign ticket to a non-staff/admin user' });
        return;
    }

    ticket.assignedTo = assignedTo;
    const updatedTicket = await ticket.save();

     // Populate the updated ticket for the response
    const populatedTicket = await Ticket.findById(updatedTicket._id)
        .populate('customer', 'name email')
        .populate('assignedTo', 'name email')
        .populate('category', 'categoryName')
         .populate({ // Populate comments and their authors
            path: 'comments',
            populate: {
              path: 'author',
              select: 'name role',
            },
          })
        .populate('fileAttachments', 'fileName link'); // Populate file attachments

    res.json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Upload a file attachment to a ticket
// @route   POST /api/tickets/:ticketId/upload
// @access  Authenticated User (Customer if owned, Staff, Admin)
const uploadFileAttachment = async (req, res) => {
  const ticketId = req.params.ticketId;
  const userId = req.user._id;
  const userRole = req.user.role;

  upload(req, res, async (err) => {
    if (err) {
      res.status(400).json({ message: err });
    } else if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
    } else {
      try {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
          res.status(404).json({ message: 'Ticket not found' });
          return;
        }

        // Check if the user is authorized to upload files to this ticket
        const isCustomerOwner = ticket.customer.equals(userId);
        const isStaffOrAdmin = userRole === 'staff' || userRole === 'admin';

        if (!isCustomerOwner && !isStaffOrAdmin) {
          res.status(403).json({ message: `User role ${userRole} is not authorized to upload files to this ticket` });
          return;
        }

        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
          {
            folder: 'wads-masi_idup', // Optional: specify a folder in your Cloudinary account
            resource_type: 'auto', // Automatically detect file type
          }
        );

        // Create file attachment document with Cloudinary URL
        const fileAttachment = await FileAttachment.create({
          ticket: ticketId,
          link: result.secure_url, // Store the secure Cloudinary URL
          fileName: req.file.originalname,
        });

        // Add the file attachment reference to the ticket
        ticket.fileAttachments.push(fileAttachment._id);
        await ticket.save();

        res.status(201).json(fileAttachment);
      } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
      }
    }
  });
};

// @desc    Get daily ticket statistics (for charts)
// @route   GET /api/tickets/stats/daily
// @access  Staff, Admin
const getDailyTicketStats = async (req, res) => {
  // Only staff and admin can view stats
  if (req.user.role !== 'staff' && req.user.role !== 'admin') {
    res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
    return;
  }

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Get date 7 days ago

    const dailyStats = await Ticket.aggregate([
      {
        $match: { // Filter tickets created in the last 7 days
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: { // Group by day and count
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { // Sort by date
          _id: 1
        }
      }
    ]);

    // Optional: Fill in dates with zero counts if no tickets were created on that day
    // For simplicity, we'll just return the stats for days with tickets for now.
    // Frontend can handle filling in missing dates with 0.

    res.json(dailyStats); // Respond with the aggregated stats
  } catch (error) {
    console.error('Error fetching daily ticket stats:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get average response time statistics (for charts)
// @route   GET /api/tickets/stats/response-time
// @access  Staff, Admin
const getAverageResponseTime = async (req, res) => {
  // Only staff and admin can view stats
  if (req.user.role !== 'staff' && req.user.role !== 'admin') {
    res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
    return;
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Aggregate to calculate response time (time from creation to update) for tickets updated in the last 30 days
    const responseTimeStats = await Ticket.aggregate([
      {
        $match: {
          updatedAt: { $gte: thirtyDaysAgo },
          status: { $in: ['in progress', 'closed'] }
        }
      },
      {
        $addFields: {
          durationHours: { $divide: [{ $subtract: ["$updatedAt", "$createdAt"] }, 3600000] }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          averageResponseTimeHours: { $avg: "$durationHours" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json(responseTimeStats);
  } catch (error) {
    console.error('Error fetching average response time stats:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { createTicket, getTickets, getTicketById, updateTicket, deleteTicket, assignTicket, uploadFileAttachment, getDailyTicketStats, getAverageResponseTime }; 