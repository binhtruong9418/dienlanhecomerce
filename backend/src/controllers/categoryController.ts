import { Request, Response } from 'express';
import Category from '../models/Category';
import slugify from 'slugify';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const query: any = {};

    // - User (no status param): only active
    // - Admin status=all: active + inactive (exclude deleted)
    // - Admin status=deleted: only deleted  
    // - Admin specific status: that status
    if (status) {
      if (status === 'all') {
        query.status = { $in: ['active', 'inactive'] };
      } else {
        query.status = status;
      }
    } else {
      query.status = 'active';
    }

    const categories = await Category.find(query)
      .sort({ order: 1, name: 1 });

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// Admin controllers
export const createCategory = async (req: Request, res: Response) => {
  try {
    const categoryData = req.body;

    // Generate slug if not provided
    if (!categoryData.slug) {
      categoryData.slug = slugify(categoryData.name, {
        lower: true,
        strict: true,
      });
    }

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      category: updatedCategory,
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    }

    // Soft delete: set status to 'deleted'
    category.status = 'deleted';
    await category.save();

    res.json({
      success: true,
      message: 'Xóa danh mục thành công',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

export const updateCategoryStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error('Update category status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

export const updateCategoryOrder = async (req: Request, res: Response) => {
  try {
    const { order } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { order },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error('Update category order error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};