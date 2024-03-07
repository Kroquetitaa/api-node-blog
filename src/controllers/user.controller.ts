import UserModel from "../models/user.models";
import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { User } from "../interfaces";
import { validate } from "../helpers/validators/validate";
import { comparePassword, hashPassword } from "../helpers/bcrypt/bcrypt";
import { createToken, decodedAndRefreshToken } from "../helpers/validators/jwt";

type ErrorMessage = {
  status: number;
  message: string;
};

interface AuthenticatedRequest extends Request {
  user?: any;
}

//@POST auth/register
export const registerUser = async (req: Request, res: Response) => {
  try {
    const params: User = req.body;

    const user = await UserModel.find({
      email: params.email.toLowerCase(),
    });
    if (user && user.length >= 1) {
      return res.status(StatusCodes.CREATED).json({
        status: "Error",
        message: "User already exists",
      });
    }

    const response: ErrorMessage = validate(params);

    if (response.status !== StatusCodes.OK) {
      return res.status(response.status).json({
        message: response.message,
      });
    }

    let pwd = await hashPassword(params.password, 10);
    params.password = pwd;

    let userSaveInDB = new UserModel(params);
    userSaveInDB = await userSaveInDB.save();

    return res.status(StatusCodes.OK).json({
      message: ReasonPhrases.CREATED,
      user: userSaveInDB,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: "Error",
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    let params: User = req.body;

    if (!params.email || !params.password) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        status: "Error",
        message: "There are missing fields to send",
      });
    }

    const userEmail = await UserModel.findOne({ email: params.email });
    if (userEmail) {
      const pwd = comparePassword(params.password, userEmail.password);
      if (!pwd) {
        return res.status(StatusCodes.UNAUTHORIZED).send({
          status: "Error",
          message: "Wrong password",
        });
      }
    }

    const token = createToken(userEmail);
    console.log(token);
    return res.status(StatusCodes.OK).send({
      status: "Success",
      message: "Logged in",
      user: userEmail,
      token: token,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: "Error",
      message: "Internal server error",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "No token provided" });
    }

    const newToken = decodedAndRefreshToken(token, res);

    console.log(newToken);

    return res.status(StatusCodes.OK).send({
      status: "Success",
      message: "Refreshed token",
      token: newToken,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: "Error",
      message: "Internal server error",
    });
  }
};

export const profile = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log(id);
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: "Error",
        message: "User not found",
      });
    }
    return res.status(200).send({
      status: "Success",
      message: "User found",
      user,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: "Error",
      message: "Internal server error",
    });
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    let user = req.user;
    let userToUpdate = req.body;

    let pwd = await hashPassword(userToUpdate.password, 10);
    userToUpdate.password = pwd;

    const data = await UserModel.findOneAndUpdate(
      {
        email: user.email.toLowerCase(),
      },
      userToUpdate,
      { new: true }
    );

    if (!data) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: "Error",
        message: "User not found",
      });
    }

    return res.status(StatusCodes.OK).send({
      status: "Success",
      message: "User updated successfully",
      user: data,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: "Error",
      message: "Internal server error",
    });
  }
};
