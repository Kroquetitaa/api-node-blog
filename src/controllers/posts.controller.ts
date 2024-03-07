import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import PostsModel from "../models/posts.models";
import CategoriesModel from "../models/categories.models";
import UserModel from "../models/user.models";

interface AuthenticatedRequest extends Request {
  user?: any;
}


export const createPosts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const params = req.body
    if(!params.title ||!params.content ||!params.slug) {
      return res.status(StatusCodes.BAD_REQUEST).send({
              status: "Error",
              message: "Title, content and slug are required",
            });
    }
    const existingCategory = await CategoriesModel.findOne({ slug: params.slug })
    if(!existingCategory) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: "Error",
        message: "Category not found with the provided slug",
      });
    }

    const categoryID = existingCategory.id
    if(!categoryID ) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: "Error",
        message: "Category ID not found",
      });
    }

    const post = new PostsModel(params)
    await post.save()
    console.log( post )

    const categoryUpdate = await CategoriesModel.findByIdAndUpdate(
      categoryID,
      {$push: {posts: categoryID} },
      {new: true}
    )
    if(!categoryUpdate) {
      return res.status(StatusCodes.NOT_FOUND).send({
              status: "Error",
              message: "Category not updated",
            });
    }
    return res.status(StatusCodes.OK).send({
      status: "Success",
      message: "Post saved",
      post,
      categoryUpdate,
    });
    
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: "Error",
      message: "Internal server error",
    });
  }
};

export const listPost = async (req: Request, res: Response) => {
  try{
    let page = req.params.page ? parseInt(req.params.page) : 1;

    page = Number(page);

    let limit = 3;

    const skip = (page - 1) * limit;

    const totalPosts = await PostsModel.countDocuments();
    const allPosts = await PostsModel.find()
      .sort("title")
      .skip(skip)
      .limit(limit)

    return res.status(StatusCodes.OK).send({
      status: "Success",
      message: "All categories",
      totalPosts,
      page: page,
      categoriesPage: limit,
      allPosts: allPosts,
    });

  }catch(err){
    console.log(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: "Error",
      message: "Internal server error",
    });
  }
}


export const deletedPostByID = async(req: AuthenticatedRequest, res: Response) => {
  try{
    const id = req.params.id

    const post = await PostsModel.findByIdAndDelete(id);
    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: "Error",
        message: "Category not found",
      });
    }

    return res.status(StatusCodes.OK).send({
      status: "Success",
      message: "Category deleted successfully",
      post,
    });
  }catch(err){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: "Error",
      message: "Internal server error",
    });
  }
}