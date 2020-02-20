const User      = require('../../models/User')
const Leader    = require('../../models/Leader')
const router    = require('express').Router()
const bcrypt    = require('bcryptjs')
const jwt       = require('jsonwebtoken')

// @route   POST /api/users
// @desc    Register New User
// @access  Public

router.post('/', async (req, res) => {
    const userInfo = { name, grade, academy, email, password } = req.body

    // Simple validation
    if (!name || !grade || !academy || !email || !password)
        return res.status(400).json({ msg: 'Please enter all fields' })
    
    // Check for existing user
    const user = await User.findOne({ email })
    if (user) return res.status(400).json({ msg: 'User with given email already exists' })

    // Create User
    const newUser = new User(userInfo)

    // if user is a spark leader add extra info
    if (req.body.type === 'leader') {
        const leaderInfo = { activities, committees, headshot } = req.body

        const leader = new Leader(leaderInfo)
        newUser.leader_data = leader._id
    }

    try {
        // Create password hash
        const salt = await bcrypt.genSalt()
        const hash = await bcrypt.hash(password, salt)

        newUser.password = hash
        let user = await newUser.save()

        const token = await jwt.sign({ id: user.id }, process.env.JWT, { expiresIn: 86400 })

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                grade: user.grade,
                academy: user.academy,
                email: user.email,
            }
        })
    } catch(err) {
        console.log(err)
        res.status(500).send({ msg: 'Error Creating User' })
    }
})

module.exports = router