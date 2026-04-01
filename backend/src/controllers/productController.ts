// Public product handlers
import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';

// @desc    Get all products with filters/pagination
// @route   GET /api/products
// @access  Public
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

    // Helper to parse comma-separated or array params
    const parseParam = (param: any): string[] => {
      if (!param) return [];
      if (Array.isArray(param)) return param.map(p => p.toString());
      return param.toString().split(',').filter(Boolean);
    };

    const query: any = {};

    // Category filter: accepts both ObjectId and slug
    if (category) {
      const categoryValues = parseParam(category);
      const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

      const ids: string[] = [];
      const slugs: string[] = [];

      categoryValues.forEach(val => {
        if (isValidObjectId(val)) ids.push(val);
        else slugs.push(val);
      });

      let categoryIds: string[] = [...ids];

      if (slugs.length > 0) {
        const categoryDocs = await Category.find({ slug: { $in: slugs } });
        categoryIds = [...categoryIds, ...categoryDocs.map(doc => doc._id.toString())];
      }

      if (categoryIds.length > 0) {
        query.category = { $in: categoryIds };
      }
    }

    if (brand) query.brand = brand.toString();

    if (power) {
      const powerValues = parseParam(power);
      query.power = { $in: powerValues };
    }

    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    // Status filter:
    // - No param: active only (public)
    // - status=all: active + inactive (admin)
    // - status=deleted / specific: exact match (admin)
    if (status) {
      const statusStr = status.toString();
      query.status = statusStr === 'all' ? { $in: ['active', 'inactive'] } : statusStr;
    } else {
      query.status = 'active';
    }

    if (search) {
      const searchRegex = new RegExp(search.toString(), 'i');
      query.$or = [{ name: searchRegex }, { productModel: searchRegex }];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = {};
    sort[sortBy.toString()] = sortOrder === 'asc' ? 1 : -1;

    const [products, total] = await Promise.all([
      Product.find(query).populate('category', 'name slug').sort(sort).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// @desc    Get product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    product.views += 1;
    await product.save();

    res.json({ success: true, product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// @desc    Get featured products (sorted by views)
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 6;

    const products = await Product.find({ status: 'active', inStock: true })
      .populate('category', 'name slug')
      .sort({ views: -1, createdAt: -1 })
      .limit(limit);

    res.json({ success: true, products });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// @desc    Get related products (same category)
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 4;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    const products = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      status: 'active',
    })
      .populate('category', 'name slug')
      .limit(limit);

    res.json({ success: true, products });
  } catch (error) {
    console.error('Get related products error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// @desc    Full-text search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập từ khóa tìm kiếm' });
    }

    const products = await Product.find(
      { $text: { $search: q as string }, status: 'active' },
      { score: { $meta: 'textScore' } }
    )
      .populate('category', 'name slug')
      .sort({ score: { $meta: 'textScore' } })
      .limit(Number(limit));

    res.json({ success: true, products });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// @desc    Get filter options with product counts (replaces client-side aggregation)
// @route   GET /api/products/filters
// @access  Public
export const getProductFilters = async (req: Request, res: Response) => {
  try {
    const [categoryAgg, powerAgg] = await Promise.all([
      Product.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
      Product.aggregate([
        { $match: { status: 'active', power: { $exists: true, $ne: '' } } },
        { $group: { _id: '$power', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const categoryIds = categoryAgg.map(item => item._id).filter(Boolean);
    const categories = await Category.find({ _id: { $in: categoryIds }, status: 'active' })
      .select('_id name slug order')
      .sort({ order: 1 });

    const categoriesWithCount = categories.map(cat => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      count: categoryAgg.find(a => a._id?.toString() === cat._id?.toString())?.count || 0,
    }));

    const powerOptions = powerAgg
      .filter(item => item._id)
      .map(item => ({ value: item._id, label: item._id, count: item.count }));

    res.json({ success: true, categories: categoriesWithCount, powerOptions });
  } catch (error) {
    console.error('Get product filters error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
