import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import slugify from 'slugify';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
// Trong productController.ts - hàm getProducts

export const getProducts = async (req: Request, res: Response) => {
    try {
      const {
        category,
        brand,
        power,
        priceMin,
        priceMax,
        status,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 12,
      } = req.query;
  
      // Helper để parse param thành string array
      const parseParam = (param: any): string[] => {
        if (!param) return [];
        if (Array.isArray(param)) {
          return param.map(p => p.toString());
        }
        return param.toString().split(',').filter(Boolean);
      };
  
      // Build query
      const query: any = {};
  
      // Xử lý category - nhận cả ID và slug
      if (category) {
        const categoryValues = parseParam(category);
        console.log('Category values:', categoryValues);
        
        // Kiểm tra xem value là ObjectId hợp lệ hay slug
        const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);
        
        const ids: string[] = [];
        const slugs: string[] = [];
        
        categoryValues.forEach(val => {
          if (isValidObjectId(val)) {
            ids.push(val);
          } else {
            slugs.push(val);
          }
        });
        
        console.log('Category IDs:', ids);
        console.log('Category slugs:', slugs);
        
        // Tìm category theo IDs
        let categoryIds: string[] = [];
        
        if (ids.length > 0) {
          categoryIds = [...ids];
        }
        
        // Tìm category theo slugs
        if (slugs.length > 0) {
          const categoryDocs = await Category.find({ slug: { $in: slugs } });
          const slugIds = categoryDocs.map(doc => doc._id.toString());
          categoryIds = [...categoryIds, ...slugIds];
        }
        
        if (categoryIds.length > 0) {
          query.category = { $in: categoryIds };
          console.log('Category query:', query.category);
        }
      }
  
      // Xử lý brand
      if (brand) {
        query.brand = brand.toString();
      }
  
      // Xử lý power
      if (power) {
        const powerValues = parseParam(power);
        query.power = { $in: powerValues };
      }
  
      // Xử lý price range
      if (priceMin || priceMax) {
        query.price = {};
        if (priceMin) query.price.$gte = Number(priceMin);
        if (priceMax) query.price.$lte = Number(priceMax);
      }
  
      // Xử lý status
      // - User (no status param): only active
      // - Admin status=all: active + inactive (exclude deleted)
      // - Admin status=deleted: only deleted
      // - Admin specific status: that status
      if (status) {
        const statusStr = status.toString();
        if (statusStr === 'all') {
          query.status = { $in: ['active', 'inactive'] };
        } else {
          query.status = statusStr;
        }
      } else {
        query.status = 'active';
      }
  
      // Xử lý search
      if (search) {
        const searchRegex = new RegExp(search.toString(), 'i');
        query.$or = [
          { name: searchRegex },
          { productModel: searchRegex }
        ];
      }
  
      // Pagination
      const skip = (Number(page) - 1) * Number(limit);
  
      // Sort
      const sort: any = {};
      sort[sortBy.toString()] = sortOrder === 'asc' ? 1 : -1;
  
      const products = await Product.find(query)
        .populate('category', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));
  
      const total = await Product.countDocuments(query);
  
      res.json({
        success: true,
        products,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
      });
    }
};

// @desc    Get product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 6;

    const products = await Product.find({ status: 'active', inStock: true })
      .populate('category', 'name slug')
      .sort({ views: -1, createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 4;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    const products = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      status: 'active',
    })
      .populate('category', 'name slug')
      .limit(limit);

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('Get related products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập từ khóa tìm kiếm',
      });
    }

    const products = await Product.find(
      { $text: { $search: q as string }, status: 'active' },
      { score: { $meta: 'textScore' } }
    )
      .populate('category', 'name slug')
      .sort({ score: { $meta: 'textScore' } })
      .limit(Number(limit));

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// Admin controllers
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;

    // Generate slug
    productData.slug = slugify(productData.name, {
      lower: true,
      strict: true,
    });

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    res.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id)
        .populate('category', 'name slug');
    
        if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy sản phẩm',
        });
        }
    
        res.json({
        success: true,
        product,
        });
    } catch (error) {
        console.error('Get product by ID error:', error);
        res.status(500).json({
        success: false,
        message: 'Lỗi server',
        });
    }
    }

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    // Soft delete: set status to 'deleted'
    product.status = 'deleted';
    await product.save();

    res.json({
      success: true,
      message: 'Xóa sản phẩm thành công',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

export const updateProductStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Update product status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};