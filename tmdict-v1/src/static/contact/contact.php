<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title></title>
<link rel="shortcut icon" href="../favicon.ico">
<style type="text/css">
#facebox {font-size:0.8em;}
#facebox .content {width:320px;}
#facebox .close {top:0;}
#facebox h2 {background:transparent;margin-left:8px;font-size:1.4em;}
#facebox fieldset {border:0;}
#facebox legend {font-size:0.9em;}
#facebox input[type=submit] {width:80px;}
.antispam {display:none;}
</style>
<script type="text/javascript">
    $(document).ready(function() {
        $('#submitform').ajaxForm({
            target: '#error',
            success: function() {
            $('#error').fadeIn('slow');
            }
        });
    });
    var lang = window.location.href.toString().split(window.location.host)[1].split('/')[1];
    $('#subject').val('TMdict[' + lang + ']: ');
</script>
</head>
<body>
<h2 id="contacth2">Contact</h2>
<div id="contactform">
<div id="formleft">
    <form id="submitform" action="../contact/submitemail.php" method="post">
        <fieldset>
            <legend>Name</legend>
            <input type="text" name="name" />
        </fieldset>

        <fieldset>
            <legend>Email</legend>
            <input type="text" name="email" />
        </fieldset>

        <fieldset>
            <legend>Subject</legend>
            <input type="text" name="subject" id="subject" />
        </fieldset>

        <fieldset class="antispam">
            <legend>Leave this empty</legend>
            <input type="text" name="url" />
        </fieldset>

        <fieldset>
            <legend>Message</legend>
            <textarea rows="5" cols="35" name="message"></textarea>
        </fieldset>

        <fieldset>
            <input type="submit" class="button" value="Submit" />
        </fieldset>
    </form>
    </div>
    <div id="error">

    </div>
<div class="clear"></div>
</div>
</body>
</html>