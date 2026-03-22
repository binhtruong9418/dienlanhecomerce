import { Request, Response } from 'express';
import QuoteRequest from '../models/QuoteRequest';
import { uploadMultipleToCloudinary } from '../middleware/upload';

// @desc    Submit quote request
// @route   POST /api/quotes
// @access  Public
export const submitQuoteRequest = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    let fileUrls: string[] = [];

    // Upload files to Cloudinary if any
    if (files && files.length > 0) {
      fileUrls = await uploadMultipleToCloudinary(files, 'quotes');
    }

    const quoteData = {
      ...req.body,
      files: fileUrls.map((url, index) => ({
        name: files[index].originalname,
        url,
        size: files[index].size,
      })),
    };

    const quote = await QuoteRequest.create(quoteData);

    // TODO: Send email notification to admin
    // await sendEmail({
    //   to: process.env.ADMIN_EMAIL,
    //   subject: 'Yêu cầu báo giá mới',
    //   template: 'new-quote',
    //   data: quote,
    // });

    res.status(201).json({
      success: true,
      quote,
    });
  } catch (error) {
    console.error('Submit quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// Admin controllers
export const getQuoteRequests = async (req: Request, res: Response) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { product: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const requests = await QuoteRequest.find(query)
      .populate('productId', 'name slug')
      .populate('quotedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await QuoteRequest.countDocuments(query);

    res.json({
      success: true,
      requests,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('Get quote requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

export const getQuoteRequestById = async (req: Request, res: Response) => {
  try {
    const quote = await QuoteRequest.findById(req.params.id)
      .populate('productId', 'name slug price')
      .populate('quotedBy', 'name');

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu',
      });
    }

    res.json({
      success: true,
      quote,
    });
  } catch (error) {
    console.error('Get quote request error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

export const updateQuoteStatus = async (req: Request, res: Response) => {
  try {
    const { status, quotedPrice } = req.body;
    const userId = req.user._id;

    const updateData: any = { status };

    if (status === 'quoted') {
      updateData.quotedPrice = quotedPrice;
      updateData.quotedBy = userId;
      updateData.quotedAt = new Date();
    } else if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const quote = await QuoteRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu',
      });
    }

    // TODO: Send email to customer about status update
    // await sendEmail({
    //   to: quote.email,
    //   subject: 'Cập nhật trạng thái yêu cầu báo giá',
    //   template: 'quote-status-update',
    //   data: quote,
    // });

    res.json({
      success: true,
      quote,
    });
  } catch (error) {
    console.error('Update quote status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

export const addQuoteNote = async (req: Request, res: Response) => {
  try {
    const { note } = req.body;

    const quote = await QuoteRequest.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu',
      });
    }

    // Add note to notes field
    const newNote = `[${new Date().toLocaleString('vi-VN')}] ${note}`;
    quote.notes = quote.notes 
      ? `${quote.notes}\n\n${newNote}`
      : newNote;

    await quote.save();

    res.json({
      success: true,
      quote,
    });
  } catch (error) {
    console.error('Add quote note error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

export const deleteQuoteRequest = async (req: Request, res: Response) => {
  try {
    const quote = await QuoteRequest.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu',
      });
    }

    await quote.deleteOne();

    res.json({
      success: true,
      message: 'Xóa yêu cầu thành công',
    });
  } catch (error) {
    console.error('Delete quote request error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};