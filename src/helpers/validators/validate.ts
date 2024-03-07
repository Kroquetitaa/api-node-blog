import validator from "validator";
import { StatusCodes } from "http-status-codes";
import { User } from "../../interfaces";

// export const validate = (params: any) => {
//     let message: string = "";

//     let emailIsValid = validator.isEmail(params.email);
//     let emailIsEmpty = validator.isEmpty(params.email);

//     let passwordIsEmpty = validator.isEmpty(params.password);

//     if (!emailIsValid || emailIsEmpty || passwordIsEmpty) {
//       if (emailIsEmpty) message += "Email is required. ";
//       else if (!emailIsValid) message += "Email is not valid. ";
//       if (passwordIsEmpty) message += "Password is required. ";
//       return { status: StatusCodes.CONFLICT, message: message };
//     } else {
//       return { status: StatusCodes.ACCEPTED, message: "Validated" };
//     }
//   };

export const validate = (params: User) => {
  let message: string = "";

  if (
    !params.email ||
    !params.email.trim() ||
    !params.password ||
    !params.password.trim()
  ) {
    if (!params.email || !params.email.trim()) message += "Email is required. ";
    if (!params.password || !params.password.trim())
      message += "Password is required. ";
    return { status: StatusCodes.CONFLICT, message: message };
  }

  if (!validator.isEmail(params.email)) {
    message += "Email is not valid";
    return { status: StatusCodes.CONFLICT, message: message };
  }

  return { status: StatusCodes.OK, message: "Validated" };
};

