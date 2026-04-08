import * as Yup from "yup";

export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Za-z\s]{2,50}$/, "Name must be 2-50 letters and spaces only")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
      "Password must be at least 8 characters, with uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),
});