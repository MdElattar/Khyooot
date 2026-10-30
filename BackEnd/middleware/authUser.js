import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    // Check both standard 'authorization' and custom 'token' headers used in your frontend
    const token = req.headers.token || req.headers.authorization;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach ID to body for orderController and user object for cartController
        req.body.userId = token_decode.id;
        req.user = { _id: token_decode.id }; 
        
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default authUser;