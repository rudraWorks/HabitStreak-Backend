import Users from "../models/Users.js"
import jwt from 'jsonwebtoken'
import stripe from "stripe"
import * as dotenv from 'dotenv';
import mongoose from "mongoose"

dotenv.config();


const Stripe = stripe(process.env.STRIPE)
// const coupon = await Stripe.coupons.create({
//     duration: 'once',
//     id: 'dYlq971Xl', 
//     percent_off: 100, 
// });

const createToken = (email) => {
    return jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: '20d' }
    )
}

export const login = async (req, res) => {
    let { name, email, picture } = req.body
    name = name.trim()
    email = email.trim()
    picture = picture.trim()

    if (!name || !email || !picture) {
        return res.status(400).json({ message: 'Invalid input' })
    }

    try {
        let user = await Users.findOne({ email })
        if (!user) {
            user = await Users.create({ name, email, picture })
        }
        const token = createToken(user.email, 'user')
        return res.status(200).json({ token, pro: user.pro, _id: user._id })
    }
    catch (e) {
        // console.log(e.message);
        return res.status(400).json({ message: e.message })
    }
} 

export const verifyToken = async (req, res) => {
    const { authorization } = req.headers
    if (!authorization)
        return res.status(401).json({ message: 'unauthorized' })
    try {
        const { email } = jwt.verify(authorization, process.env.JWT_SECRET)
        const response = await Users.findOne({ email }, { name: 0, email: 0, picture: 0, joined: 0 })
        // console.log(response)
        if (!response)
            return res.status(400).json({ message: 'User not found' })
        return res.status(200).json({ _id: response._id, pro: response.pro })
    }
    catch (e) {
        return res.status(401).json({ message: 'user auth failed!' })
    }

}

export const checkout = async (req, res) => {
    try {
        const items = [req.body.items]
        const _id = req.body._id
        // console.log(_id)
        let lineItems = []
        items.forEach(item => {
            lineItems.push({
                price: item.id,
                quantity: item.quantity
            })
        });

        const session = await Stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            // discounts: [{
            //     coupon: 'MSqiTe41',
            // }],
            allow_promotion_codes: true,
            // success_url:'http://localhost:3000/success',
            success_url: `https://practicehero.site/auth/activate/${_id}`,
            // success_url:`https://fine-jade-crab-hat.cyclic.app/${_id}`,
            cancel_url: 'https://www.habitstreak.xyz/pro'
        })

        return res.send(JSON.stringify({
            url: session.url
        }))
    }
    catch (e) {
        return res.send(JSON.stringify({
            url: 'https://habitstreak.xyz/pro'
        }))
    }
}

export const activate = async (req, res) => {
    try {
        const _id = req.params._id
        // console.log(_id)
        const response = await Users.updateOne(
            { _id: new mongoose.Types.ObjectId(_id) },
            { $set: { pro: true } }
        )
        // console.log(response);
        return res.redirect('https://habitstreak.xyz/profile')
    }
    catch (e) {
        // console.log(e.message);
        return res.redirect('https://habitstreak.xyz/profile')
    }
}
