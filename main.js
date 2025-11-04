/*
	Spectral by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/



const jwt = require("jsonwebtoken");

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Authenticate user with your existing logic
  const user = await authenticateUser(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Create JWT payload with user information
  const payload = {
    user_id: user.id,                    // Required: unique user identifier
    email: user.email,                   // User's email
    name: user.name,                     // User's full name
    phonenumber: user.phone,            // User's phone number
    stripe_accounts: [                    // Stripe integration
      {
        "label": "Default Account",
        "stripe_id": user.stripe_customer_id
      }
    ],
    custom_attributes: {                 // Custom user data
      "signup_date": user.signup_date,
      "support_tier": user.support_tier,
      "company": user.company
    },
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
  };
  
  // Sign the JWT with your Chatbase secret
  const token = jwt.sign(payload, process.env.CHATBASE_SECRET, { algorithm: 'HS256' });
  
  res.json({
    user: user,
    token: token  // Send JWT to frontend
  });
});


// After successful login
async function loginUser() {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@example.com', password: 'password' })
  });
  
  const { user, token } = await response.json();
  
  // Identify user to Chatbase and also update/insert this contact
  window.chatbase("identify", {
    token: token,  // JWT contains all user data
    name: user.name // public metadata sent to the chatbot
  });
}







(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#page-wrapper'),
		$banner = $('#banner'),
		$header = $('#header');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Mobile?
		if (browser.mobile)
			$body.addClass('is-mobile');
		else {

			breakpoints.on('>medium', function() {
				$body.removeClass('is-mobile');
			});

			breakpoints.on('<=medium', function() {
				$body.addClass('is-mobile');
			});

		}

	// Scrolly.
		$('.scrolly')
			.scrolly({
				speed: 1500,
				offset: $header.outerHeight()
			});

	// Menu.
		$('#menu')
			.append('<a href="#menu" class="close"></a>')
			.appendTo($body)
			.panel({
				delay: 500,
				hideOnClick: true,
				hideOnSwipe: true,
				resetScroll: true,
				resetForms: true,
				side: 'right',
				target: $body,
				visibleClass: 'is-menu-visible'
			});

	// Header.
		if ($banner.length > 0
		&&	$header.hasClass('alt')) {

			$window.on('resize', function() { $window.trigger('scroll'); });

			$banner.scrollex({
				bottom:		$header.outerHeight() + 1,
				terminate:	function() { $header.removeClass('alt'); },
				enter:		function() { $header.addClass('alt'); },
				leave:		function() { $header.removeClass('alt'); }
			});

		}

})(jQuery);