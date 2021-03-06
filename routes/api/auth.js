const User      = require('../../models/User')
const router    = require('express').Router()
const bcrypt    = require('bcryptjs')
const jwt       = require('jsonwebtoken')
const { setCookie, auth }  = require('../../middleware/auth')

// @route   POST /api/auth
// @desc    Authenticate User
// @access  Public

router.post('/', async (req, res) => {
    const { email, password } = req.body

    // Simple validation
    if (!email || !password)
        return res.status(400).json({ msg: 'Please Enter All Fields' })
    
    // Check for existing user
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ msg: 'User Does Not Exist' })

    try {
        const isMatched = await bcrypt.compare(password, user.password)
        if (!isMatched) return res.status(400).json({ msg: 'Invalid Password' })

        const token = await jwt.sign({ _id: user.id }, process.env.JWT, { expiresIn: 21600 })
        setCookie(res, token)

        if (user.leader_data)
            res.redirect('/spark')
        else 
            res.redirect('/applicant')

    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'Error Authenticating User' })
    }
})

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
      .select('-password')
      .then(user => res.json(user))
})

// @route   GET api/auth/logout
// @desc    Logout User - clears clookie
// @access  Private
router.get('/logout', auth, (req, res) => {
    res.clearCookie('auth-token')
    res.redirect('/')
})

module.exports = router