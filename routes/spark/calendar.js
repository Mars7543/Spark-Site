const { auth, sparkAuth }  = require('../../middleware/auth')
const FAQ       = require('../../models/FAQ')
const router    = require('express').Router()

// @route   GET /spark/calendar
// @desc    Show Spark Calendar
// @access  Protected
router.get('/', auth, sparkAuth, async (req, res) => {
    try {
        res.render('spark/calendar', {
            title: "Spark Calendar",
            css: `
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/4.2.0/core/main.min.css" integrity="sha256-Lfe6+s5LEek8iiZ31nXhcSez0nmOxP+3ssquHMR3Alo=" crossorigin="anonymous" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/4.2.0/daygrid/main.min.css" integrity="sha256-AVsv7CEpB2Y1F7ZjQf0WI8SaEDCycSk4vnDRt0L2MNQ=" crossorigin="anonymous" />
                <link rel="stylesheet" href="/css/spark/micromodal.css" />
                <link rel="stylesheet" href="/css/spark/calendar.css" />
            `,
            js: `
                <script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/4.2.0/core/main.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/4.2.0/daygrid/main.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/4.2.0/interaction/main.min.js"></script>
                <script src="https://unpkg.com/micromodal/dist/micromodal.min.js"></script>
                <script src="/js/spark/calendar.js"></script>
            `,
            user: req.user
        })
    } catch (e) {
        console.log(e)
        res.status(500).send('Server Error')
    }
})

module.exports = router