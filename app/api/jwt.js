import Jwt  from "jsonwebtoken";

const secret = 'wO4k7kzoHP'

export const generateToken = (payload) => {
    return Jwt.sign(payload, secret, {expiresIn: '1h'})
}