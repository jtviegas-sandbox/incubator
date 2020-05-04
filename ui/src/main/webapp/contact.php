<!doctype html>
<html>

<head>
  <title>Contact Us</title>
  <meta name="description" content="website description" />
  <meta name="keywords" content="website keywords, website keywords" />
  <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
  <link rel="stylesheet" type="text/css" href="css/style.css" />
  <!-- modernizr enables HTML5 elements and feature detects -->
  <script type="text/javascript" src="js/modernizr-1.5.min.js"></script>
</head>

<body>
  <div id="main">
    <header>
      <div id="logo">
        <div id="logo_text">
          <!-- class="logo_colour", allows you to change the colour of the text -->
          <h1><a href="index.html">IBM<span class="logo_colour">Endpoint Manager</span></a></h1>
          <h2>Automation Plan Action Analyser</h2>
        </div>
        <form method="post" action="#" id="search">
          <input class="search" type="text" name="search_field" value="search....." onclick="javascript: document.forms['search'].search_field.value=''" />
          <input name="search" type="image" style="float: right;border: 0; margin: 20px 0 0 0;" src="images/search.png" alt="search" title="search" />
        </form>
      </div>
      <nav>
        <ul class="sf-menu" id="nav">
          <li><a href="index.html">About</a></li>
          <li><a href="tasklist.html">Task List</a></li>
          <li><a href="barchart.html">Bar Chart</a></li>
          <li><a href="piechart.html">Pie Chart</a></li>
          <li><a href="linechart.html">Line Chart</a>
          <li class="current"><a href="contact.php">Contact Us</a></li>
      </nav>
    </header>
	
    <div id="site_content">
		<div id="sidebar_container">
        
			<div class="sidebar">
			  <h3>Failed Plans</h3>
			  <div class="sidebar_item">
				<ul>
				  <li><a href="#">link 1</a></li>
				  <li><a href="#">link 2</a></li>
				  <li><a href="#">link 3</a></li>
				</ul>
			  </div>
			  <div class="sidebar_base"></div>
			</div>
			
			<div class="sidebar">
			  <h3>Running Plans</h3>
			  <div class="sidebar_item">
				<ul>
				  <li><a href="#">link 1</a></li>
				  <li><a href="#">link 2</a></li>
				  <li><a href="#">link 3</a></li>
				</ul>
			  </div>
			  <div class="sidebar_base"></div>
			</div>
			
			<div class="sidebar">
			  <h3>Completed Plans</h3>
			  <div class="sidebar_item">
				<ul>
				  <li><a href="#">link 1</a></li>
				  <li><a href="#">link 2</a></li>
				  <li><a href="#">link 3</a></li>
				</ul>
			  </div>
			  <div class="sidebar_base"></div>
			</div>
			
			<div class="sidebar">
			  <h3>Pending Plans</h3>
			  <div class="sidebar_item">
				<ul>
				  <li><a href="#">link 1</a></li>
				  <li><a href="#">link 2</a></li>
				  <li><a href="#">link 3</a></li>
				</ul>
			  </div>
			<div class="sidebar_base"></div>
        </div>
     </div>
	  
     <div class="content">
        <h1>Contact Us</h1>
        <div class="content_item">
          <p>Say hello, using this contact form.</p>
          <?php
            // This PHP Contact Form is offered &quot;as is&quot; without warranty of any kind, either expressed or implied.
            // David Carter at www.css3templates.co.uk shall not be liable for any loss or damage arising from, or in any way
            // connected with, your use of, or inability to use, the website templates (even where David Carter has been advised
            // of the possibility of such loss or damage). This includes, without limitation, any damage for loss of profits,
            // loss of information, or any other monetary loss.

            // Set-up these 3 parameters
            // 1. Enter the email address you would like the enquiry sent to
            // 2. Enter the subject of the email you will receive, when someone contacts you
            // 3. Enter the text that you would like the user to see once they submit the contact form
            $to = 'famponsah@mail.com';
            $subject = 'Enquiry from the website';
            $contact_submitted = 'Your message has been sent.';

            // Do not amend anything below here, unless you know PHP
            function email_is_valid($email) {
								 //[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}
				return preg_match('/^[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}$/', $email);
				//return preg_match('/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i',$email);
            }
            if (!email_is_valid($to)) {
              echo '<p style="color: red;">You must set-up a valid (to) email address before this contact page will work.</p>';
            }
            if (isset($_POST['contact_submitted'])) {
              $return = "\r";
              $youremail = trim(htmlspecialchars($_POST['your_email']));
              $yourname = stripslashes(strip_tags($_POST['your_name']));
              $yourmessage = stripslashes(strip_tags($_POST['your_message']));
              $contact_name = "Name: ".$yourname;
              $message_text = "Message: ".$yourmessage;
              $user_answer = trim(htmlspecialchars($_POST['user_answer']));
              $answer = trim(htmlspecialchars($_POST['answer']));
              $message = $contact_name . $return . $message_text;
              $headers = "From: ".$youremail;
              if (email_is_valid($youremail) && !eregi("\r",$youremail) && !eregi("\n",$youremail) && $yourname != "" && $yourmessage != "" && substr(md5($user_answer),5,10) === $answer) {
                mail($to,$subject,$message,$headers);
                $yourname = '';
                $youremail = '';
                $yourmessage = '';
                echo '<p style="color: blue;">'.$contact_submitted.'</p>';
              }
              else echo '<p style="color: red;">Please enter your name, a valid email address, your message and the answer to the simple maths question before sending your message.</p>';
            }
            $number_1 = rand(1, 9);
            $number_2 = rand(1, 9);
            $answer = substr(md5($number_1+$number_2),5,10);
          ?>
          <form id="contact" action="contact.php" method="post">
            <div class="form_settings">
              <p><span>Name</span><input class="contact" type="text" name="your_name" value="<?php echo $yourname; ?>" /></p>
              <p><span>Email Address</span><input class="contact" type="text" name="your_email" value="<?php echo $youremail; ?>" /></p>
              <p><span>Message</span><textarea class="contact textarea" rows="5" cols="50" name="your_message"><?php echo $yourmessage; ?></textarea></p>
              <p style="line-height: 1.7em;">To help prevent spam, please enter the answer to this question:</p>
              <p><span><?php echo $number_1; ?> + <?php echo $number_2; ?> = ?</span><input type="text" name="user_answer" /><input type="hidden" name="answer" value="<?php echo $answer; ?>" /></p>
              <p style="padding-top: 15px"><span>&nbsp;</span><input class="submit" type="submit" name="contact_submitted" value="send" /></p>
            </div>
          </form>
        </div>
      </div>
    </div>
    <footer>
		<p><a href="index.html">About</a> | <a href="tasklist.html">Task List</a> | <a href="barchart.html">Bar Chart</a> | <a href="piechart.html">Pie Chart</a> | <a href="contact.php">Contact Us</a></p>
		<p>Copyright &copy; IBM Endpoint Manager | <a href="http://www.ibm.com">Managing your applications on the cloud!</a></p>
    </footer>
  </div>
  <!-- javascript at the bottom for fast page loading -->
  <script type="text/javascript" src="js/jquery.js"></script>
  <script type="text/javascript" src="js/jquery.easing-sooper.js"></script>
  <script type="text/javascript" src="js/jquery.sooperfish.js"></script>
  <script type="text/javascript">
    $(document).ready(function() {
      $('ul.sf-menu').sooperfish();
    });
  </script>
</body>
</html>
