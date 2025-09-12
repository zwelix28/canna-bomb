const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = null;
    this.templates = {};
    this.initializeTransporter();
    this.loadTemplates();
  }

  initializeTransporter() {
    // Email configuration from environment variables
    const emailConfig = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    };

    if (emailConfig.auth.user && emailConfig.auth.pass) {
      this.transporter = nodemailer.createTransport(emailConfig);
      console.log('Email service initialized successfully');
    } else {
      console.log('Email service disabled - email credentials not configured');
    }
  }

  loadTemplates() {
    const templateDir = path.join(__dirname, 'templates');
    
    try {
      // Load email templates
      this.templates = {
        orderPlaced: this.loadTemplate('order-placed.html'),
        orderConfirmed: this.loadTemplate('order-confirmed.html'),
        orderProcessing: this.loadTemplate('order-processing.html'),
        orderReady: this.loadTemplate('order-ready.html'),
        orderCompleted: this.loadTemplate('order-completed.html'),
        orderInvoice: this.loadTemplate('order-invoice.html'),
        adminNewOrder: this.loadTemplate('admin-new-order.html')
      };
    } catch (error) {
      console.error('Error loading email templates:', error);
    }
  }

  loadTemplate(templateName) {
    const templatePath = path.join(__dirname, 'templates', templateName);
    try {
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      return handlebars.compile(templateSource);
    } catch (error) {
      console.error(`Error loading template ${templateName}:`, error);
      return null;
    }
  }

  async sendEmail(to, subject, html, attachments = []) {
    if (!this.transporter) {
      console.log('Email service not configured - skipping email send');
      return false;
    }

    try {
      const mailOptions = {
        from: `"Canna Bomb" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        attachments
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}:`, result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendOrderPlacedEmail(user, order) {
    const template = this.templates.orderPlaced;
    if (!template) return false;

    const html = template({
      userName: `${user.firstName} ${user.lastName}`,
      orderNumber: order.orderNumber,
      orderDate: new Date(order.createdAt).toLocaleDateString('en-ZA'),
      orderTotal: order.total.toFixed(2),
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price.toFixed(2),
        total: item.total.toFixed(2)
      })),
      collectionDate: order.collectionDate,
      collectionTime: order.collectionTime,
      estimatedPickup: order.estimatedPickup
    });

    return await this.sendEmail(
      user.email,
      `Order Placed - ${order.orderNumber}`,
      html
    );
  }

  async sendOrderStatusEmail(user, order, status) {
    let template;
    let subject;

    switch (status) {
      case 'confirmed':
        template = this.templates.orderConfirmed;
        subject = `Order Confirmed - ${order.orderNumber}`;
        break;
      case 'processing':
        template = this.templates.orderProcessing;
        subject = `Order Processing - ${order.orderNumber}`;
        break;
      case 'ready':
        template = this.templates.orderReady;
        subject = `Order Ready for Pickup - ${order.orderNumber}`;
        break;
      case 'completed':
        template = this.templates.orderCompleted;
        subject = `Order Completed - ${order.orderNumber}`;
        break;
      default:
        return false;
    }

    if (!template) return false;

    const html = template({
      userName: `${user.firstName} ${user.lastName}`,
      orderNumber: order.orderNumber,
      orderDate: new Date(order.createdAt).toLocaleDateString('en-ZA'),
      orderTotal: order.total.toFixed(2),
      status: status.charAt(0).toUpperCase() + status.slice(1),
      collectionDate: order.collectionDate,
      collectionTime: order.collectionTime,
      estimatedPickup: order.estimatedPickup
    });

    return await this.sendEmail(user.email, subject, html);
  }

  async sendOrderInvoiceEmail(user, order) {
    const template = this.templates.orderInvoice;
    if (!template) return false;

    const html = template({
      userName: `${user.firstName} ${user.lastName}`,
      orderNumber: order.orderNumber,
      orderDate: new Date(order.createdAt).toLocaleDateString('en-ZA'),
      subtotal: order.subtotal.toFixed(2),
      tax: order.tax.toFixed(2),
      tip: order.tip.toFixed(2),
      total: order.total.toFixed(2),
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price.toFixed(2),
        total: item.total.toFixed(2)
      })),
      collectionDate: order.collectionDate,
      collectionTime: order.collectionTime,
      customerInfo: order.customerInfo
    });

    return await this.sendEmail(
      user.email,
      `Invoice - Order ${order.orderNumber}`,
      html
    );
  }

  async sendAdminNewOrderEmail(adminEmail, order, user) {
    const template = this.templates.adminNewOrder;
    if (!template) return false;

    const html = template({
      orderNumber: order.orderNumber,
      customerName: `${user.firstName} ${user.lastName}`,
      customerEmail: user.email,
      orderDate: new Date(order.createdAt).toLocaleDateString('en-ZA'),
      orderTime: new Date(order.createdAt).toLocaleTimeString('en-ZA'),
      orderTotal: order.total.toFixed(2),
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price.toFixed(2),
        total: item.total.toFixed(2)
      })),
      collectionDate: order.collectionDate,
      collectionTime: order.collectionTime,
      preferredName: order.preferredName,
      orderNotes: order.orderNotes
    });

    return await this.sendEmail(
      adminEmail,
      `New Order Received - ${order.orderNumber}`,
      html
    );
  }
}

module.exports = new EmailService();
