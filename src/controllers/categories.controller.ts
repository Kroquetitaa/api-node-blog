import CategoriesModel from "../models/categories.models";
import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import UserModel from "../models/user.models";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const createCategories = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const params = req.body;

    if (!params.title || !params.slug) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        status: "Error",
        message: "Title and slug are required",
      });
    }

    const existingCategory = await CategoriesModel.findOne({
      slug: params.slug,
    });
    if (existingCategory) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        status: "Error",
        message: "Slug already exists",
      });
    }

    const category = new CategoriesModel(params);
    await category.save();

    const userId = req.user.id;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { categories: category._id } },
      { new: true }
    );
    
    return res.status(StatusCodes.OK).send({
      status: "Success",
      message: "Category saved",
      category,
      user,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: "Error",
      message: "Internal server error",
    });
  }
};

export const allCategories = async (req: Request, res: Response) => {
  try {
    let page = req.params.page ? parseInt(req.params.page) : 1;

    page = Number(page);

    let limit = 3;

    const skip = (page - 1) * limit;

    const totalCategories = await CategoriesModel.countDocuments();
    const allCategories = await CategoriesModel.find()
      .sort("title")
      .skip(skip)
      .limit(limit)
      .populate("posts")

    return res.status(StatusCodes.OK).send({
      status: "Success",
      message: "All categories",
      allCategories,
      page: page,
      categoriesPage: limit,
      totalCategories: totalCategories,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: "Error",
      message: "Internal server error",
    });
  }
};

export const categoriesByID = async (req: Request, res: Response) => {
  try {
    const categories = req.params.id;

    const categoryID = await CategoriesModel.findById(categories);
    if (!categoryID) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ status: "Error", message: "Category not found" });
    }

    return res.status(StatusCodes.OK).send({ status: "Succes", categoryID });
  } catch (err) {
    console.log( err )
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: "Error",
      message: "Internal server error",
    });
  }
};

export const updateCategoriesByID = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { title } = req.body;

    if (!title) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        status: "Error",
        message: "Title is required for update",
      });
    }

    const updatedCategory = await CategoriesModel.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    ).populate('posts');

    if (!updatedCategory) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: "Error",
        message: "Category not found",
      });
    }

    return res.status(StatusCodes.OK).send({
      status: "Success",
      message: "Category updated successfully",
      updatedCategory,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: "Error",
      message: "Internal server error",
    });
  }
};


export const deleteCategoriesByID = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const deletedCategory = await CategoriesModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: "Error",
        message: "Post not found",
      });
    }

    return res.status(StatusCodes.OK).send({
      status: "Success",
      message: "Post deleted successfully",
      deletedCategory,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: "Error",
      message: "Internal server error",
    });
  }
};
