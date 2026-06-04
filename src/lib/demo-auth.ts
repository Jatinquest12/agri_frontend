/** Demo credentials — must match backend DEMO_PHONE / DEMO_OTP */
export const DEMO_PHONE = "9898989898";
export const DEMO_OTP = "123456";

/** Admin login phone — must be listed in backend ADMIN_PHONES. */
export const ADMIN_DEMO_PHONE =
  process.env.NEXT_PUBLIC_ADMIN_DEMO_PHONE ?? "9999999999";
