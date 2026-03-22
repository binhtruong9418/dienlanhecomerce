import { Request, Response } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import Category from '../models/Category';
import QuoteRequest from '../models/QuoteRequest';
import CompanyInfo from '../models/CompanyInfo';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalProducts,
      totalCategories,
      totalQuotes,
      pendingQuotes,
      quotedQuotes,
      completedQuotes,
      recentQuotes,
      popularProducts,
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      QuoteRequest.countDocuments(),
      QuoteRequest.countDocuments({ status: 'pending' }),
      QuoteRequest.countDocuments({ status: 'quoted' }),
      QuoteRequest.countDocuments({ status: 'completed' }),
      QuoteRequest.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('customerName product quantity status createdAt'),
      Product.find()
        .sort({ views: -1, createdAt: -1 })
        .limit(5)
        .select('name views'),
    ]);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalCategories,
        totalQuotes: {
          all: totalQuotes,
          pending: pendingQuotes,
          quoted: quotedQuotes,
          completed: completedQuotes,
        },
        recentQuotes,
        popularProducts,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// @desc    Upload file
// @route   POST /api/admin/upload
// @access  Private
export const uploadFile = async (req: Request, res: Response) => {
    try {
      const file = req.file;
      const { folder } = req.body;
  
      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng chọn file',
        });
      }
  
      // URL đã được gắn vào req bởi middleware uploadSingleToCloudinary
      const fileUrl = (req as any).fileUrl;
  
      if (!fileUrl) {
        return res.status(500).json({
          success: false,
          message: 'Upload thất bại - không nhận được URL từ Cloudinary',
        });
      }
  
      res.json({
        success: true,
        url: fileUrl,
      });
    } catch (error) {
      console.error('Upload file error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
      });
    }
};

// @desc    Upload multiple files
// @route   POST /api/admin/upload-multiple
// @access  Private
export const uploadMultipleFiles = async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      const { folder } = req.body;
  
      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng chọn file',
        });
      }
  
      // URLs đã được gắn vào req bởi middleware uploadMultipleToCloudinaryMiddleware
      const fileUrls = (req as any).fileUrls || [];
  
      if (fileUrls.length === 0) {
        return res.status(500).json({
          success: false,
          message: 'Upload thất bại - không nhận được URLs từ Cloudinary',
        });
      }
  
      res.json({
        success: true,
        urls: fileUrls,
      });
    } catch (error) {
      console.error('Upload multiple files error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
      });
    }
};

// @desc    Get company info
// @route   GET /api/admin/company-info
// @access  Private
export const getCompanyInfo = async (req: Request, res: Response) => {
  try {
    let companyInfo = await CompanyInfo.findOne();

    if (!companyInfo) {
      companyInfo = await CompanyInfo.create({});
    }

    res.json({
      success: true,
      companyInfo,
    });
  } catch (error) {
    console.error('Get company info error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// @desc    Update company info
// @route   PUT /api/admin/company-info
// @access  Private
export const updateCompanyInfo = async (req: Request, res: Response) => {
  try {
    let companyInfo = await CompanyInfo.findOne();

    if (!companyInfo) {
      companyInfo = await CompanyInfo.create(req.body);
    } else {
      companyInfo = await CompanyInfo.findByIdAndUpdate(
        companyInfo._id,
        req.body,
        { new: true, runValidators: true }
      );
    }

    res.json({
      success: true,
      companyInfo,
    });
  } catch (error) {
    console.error('Update company info error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};