const Committee             = require('../../models/Committee')
const router                = require('express').Router()
const { auth, sparkAuth }   = require('../../middleware/auth')

// @route   GET /spark/committee
// @desc    Display Committee Information
// @access  Protected
router.get('/', auth, sparkAuth, async (req, res) => {
    try {
        const committees = await Committee.find({}).populate('members').exec()
        
        const primary = committees.filter(c => c.importance === "Primary")
        const secondary = committees.filter(c => c.importance === "Secondary")
        const tertiary = committees.filter(c => c.importance === "Tertiary")
        
        res.render('spark/committees', {
            title: "Spark Committees",
            css: `
                <link rel="stylesheet" href="/css/spark/committees.css" />
            `,
            js: `
                <script src="/js/spark/committees.js"></script>
            `,
            user: req.user,
            primary, secondary, tertiary
        })
    } catch (e) {
        console.log(e)
        res.status(500).send('Server Error')
    }
})

module.exports = router