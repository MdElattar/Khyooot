import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again"
      });
    }

    // تحقق مرن: لو التوكن مطابق للنص السري أو تم فكه بنجاح
    try {
      const token_decode = jwt.verify(token, process.env.JWT_SECRET);
      if (
        token_decode ===
        process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD
      ) {
        return next();
      }
    } catch (err) {
      // لو الـ verify ضرب خطأ jwt malformed بسبب إن التتوكن نص عادي، نقارنه مباشرة لو محطوط كقيمة
      if (token === process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
        return next();
      }
    }

    return res.json({
      success: false,
      message: "Not Authorized Login Again"
    });

  } catch (error) {
    console.log("Auth Error:", error.message);
    return res.json({
      success: false,
      message: "Session expired, please login again"
    });
  }
};

export default adminAuth;