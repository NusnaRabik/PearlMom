const SupportTicket = require('../models/SupportTicket');
const { successResponse, errorResponse } = require('../utils/response');
const { User } = require('../models');

// @desc    Create a new support ticket
// @route   POST /api/support/ticket
const createTicket = async (req, res) => {
  try {
    const {
      ticket_type,
      subject,
      page_url,
      browser_info,
      steps_to_reproduce,
      message,
      attachment_url
    } = req.body;

    // Validate required fields
    if (!message) {
      return errorResponse(res, 'Message is required', 400);
    }

    // Get user info if authenticated
    let user_id = null;
    let user_role = null;
    let user_name = null;
    let user_email = null;

    if (req.user && req.user.user_id) {
      user_id = req.user.user_id;
      user_role = req.user.role;
      
      const user = await User.findByPk(req.user.user_id);
      if (user) {
        user_name = user.name;
        user_email = user.email;
      }
    }

    // Create ticket
    const ticket = await SupportTicket.create({
      user_id,
      user_role,
      user_name,
      user_email,
      ticket_type: ticket_type || 'contact',
      subject: subject || null,
      page_url: page_url || null,
      browser_info: browser_info || null,
      steps_to_reproduce: steps_to_reproduce || null,
      message,
      attachment_url: attachment_url || null,
      status: 'pending',
      priority: ticket_type === 'bug' ? 'high' : 'medium'
    });

    return successResponse(res, {
      ticket: {
        ticket_id: ticket.ticket_id,
        status: ticket.status,
        created_at: ticket.created_at
      }
    }, 'Support ticket created successfully', 201);

  } catch (error) {
    console.error('Error creating support ticket:', error);
    return errorResponse(res, 'Failed to create support ticket: ' + error.message);
  }
};

// @desc    Get user's own tickets
// @route   GET /api/support/my-tickets
const getMyTickets = async (req, res) => {
  try {
    if (!req.user || !req.user.user_id) {
      return errorResponse(res, 'Authentication required', 401);
    }

    const tickets = await SupportTicket.findAll({
      where: { user_id: req.user.user_id },
      order: [['created_at', 'DESC']]
    });

    return successResponse(res, { tickets });

  } catch (error) {
    console.error('Error fetching tickets:', error);
    return errorResponse(res, 'Failed to fetch tickets');
  }
};

// @desc    Get all tickets (Admin only)
// @route   GET /api/support/tickets
const getAllTickets = async (req, res) => {
  try {
    const { status, ticket_type, limit = 50, offset = 0 } = req.query;

    const where = {};
    if (status) where.status = status;
    if (ticket_type) where.ticket_type = ticket_type;

    const tickets = await SupportTicket.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const total = await SupportTicket.count({ where });

    return successResponse(res, {
      tickets,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('Error fetching tickets:', error);
    return errorResponse(res, 'Failed to fetch tickets');
  }
};

// @desc    Get single ticket details
// @route   GET /api/support/ticket/:ticketId
const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await SupportTicket.findByPk(ticketId);

    if (!ticket) {
      return errorResponse(res, 'Ticket not found', 404);
    }

    // Check permission: user can only see their own tickets, admin can see all
    if (req.user.role !== 'admin' && ticket.user_id !== req.user.user_id) {
      return errorResponse(res, 'Unauthorized', 403);
    }

    return successResponse(res, { ticket });

  } catch (error) {
    console.error('Error fetching ticket:', error);
    return errorResponse(res, 'Failed to fetch ticket');
  }
};

// @desc    Update ticket status (Admin only)
// @route   PUT /api/support/ticket/:ticketId/status
const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, notes, priority } = req.body;

    const ticket = await SupportTicket.findByPk(ticketId);

    if (!ticket) {
      return errorResponse(res, 'Ticket not found', 404);
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;
    if (priority) updateData.priority = priority;

    if (status === 'resolved' || status === 'closed') {
      updateData.resolved_by = req.user.user_id;
      updateData.resolved_at = new Date();
    }

    await ticket.update(updateData);

    return successResponse(res, { ticket }, 'Ticket updated successfully');

  } catch (error) {
    console.error('Error updating ticket:', error);
    return errorResponse(res, 'Failed to update ticket');
  }
};

// @desc    Delete ticket (Admin only)
// @route   DELETE /api/support/ticket/:ticketId
const deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await SupportTicket.findByPk(ticketId);

    if (!ticket) {
      return errorResponse(res, 'Ticket not found', 404);
    }

    await ticket.destroy();

    return successResponse(res, null, 'Ticket deleted successfully');

  } catch (error) {
    console.error('Error deleting ticket:', error);
    return errorResponse(res, 'Failed to delete ticket');
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  deleteTicket
};