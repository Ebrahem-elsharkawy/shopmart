import * as z from "zod"

const passwordMin = { min: 6, message: "Password must be at least 6 characters" };

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required").min(3, "Name must be at least 3 characters").max(15, "Name must not exceed 15 characters"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    password: z.string().min(1, "Password is required").min(6, passwordMin.message),
    rePassword: z.string().min(1, "RePassword is required").min(6, passwordMin.message),
    phone: z.string().min(1, "Phone number is required").regex(/^01[0125][0-9]{8}$/, "Egyptian phone only (e.g. 01xxxxxxxxx)"),
}).refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "Password and RePassword must match",
});
export type registerSchemaType = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    password: z.string().min(1, "Password is required").min(6, passwordMin.message),
})
export type loginSchemaType=z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
})
export type forgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(1, "New password is required").min(6, passwordMin.message),
    reNewPassword: z.string().min(1, "Re-enter new password").min(6, passwordMin.message),
}).refine((obj) => obj.newPassword === obj.reNewPassword, {
    path: ["reNewPassword"],
    message: "New password and confirmation must match",
})
export type changePasswordSchemaType = z.infer<typeof changePasswordSchema>

export const resetPasswordSchema = z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    newPassword: z.string().min(1, "Password is required").min(6, passwordMin.message),
    resetCode: z.string().min(1, "Reset code is required"),
})
export type resetPasswordSchemaType = z.infer<typeof resetPasswordSchema>