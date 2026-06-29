const otpTemplate = (name, otp) => {
  return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<style>
body{
margin:0;
padding:0;
background:#f4f6f8;
font-family:Arial,Helvetica,sans-serif;
}

.container{
max-width:600px;
margin:30px auto;
background:white;
border-radius:12px;
overflow:hidden;
box-shadow:0 10px 30px rgba(0,0,0,.1);
}

.header{
background:#2563eb;
padding:30px;
text-align:center;
color:white;
}

.logo{
font-size:30px;
font-weight:bold;
}

.content{
padding:40px;
color:#333;
}

.button{
display:inline-block;
background:#2563eb;
color:white!important;
padding:14px 30px;
border-radius:8px;
text-decoration:none;
font-weight:bold;
margin:20px 0;
}

.otp{
font-size:42px;
font-weight:bold;
letter-spacing:12px;
background:#eef4ff;
padding:20px;
border-radius:10px;
text-align:center;
color:#2563eb;
margin:30px 0;
}

.warning{
background:#fff8e1;
padding:15px;
border-left:5px solid orange;
border-radius:5px;
}

.footer{
background:#fafafa;
padding:25px;
text-align:center;
font-size:13px;
color:#777;
}
</style>

</head>

<body>

<div class="container">

<div class="header">

<div class="logo">
🛒 ShopNest
</div>

<p>Secure Email Verification</p>

</div>

<div class="content">

<h2>Hello ${name} 👋</h2>

<p>
Welcome to <b>ShopNest</b>.
</p>

<p>
Use the following One-Time Password (OTP) to verify your email address.
</p>

<div class="otp">
${otp}
</div>

<p>
This OTP is valid for <b>5 minutes</b>.
</p>

<div class="warning">

<b>Security Notice</b>

<p>
Never share this OTP with anyone.
Our team will never ask for your OTP.
</p>

</div>

<p>
If you didn't create an account,
please ignore this email.
</p>

</div>

<div class="footer">

© ${new Date().getFullYear()} ShopNest

<br>

Secure Authentication System

</div>

</div>

</body>

</html>
`;
};

module.exports = otpTemplate;