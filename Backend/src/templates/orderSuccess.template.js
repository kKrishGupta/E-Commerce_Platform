const orderSuccessTemplate = ({
  customerName,
  orderId,
  totalAmount,
  paymentId,
  address,
  items,
}) => {
  const itemRows = items
    .map(
      (item, index) => `
      <tr>
        <td style="padding:10px;border:1px solid #ddd;">${index + 1}</td>
        <td style="padding:10px;border:1px solid #ddd;">${item.productId.name}</td>
        <td style="padding:10px;border:1px solid #ddd;">${item.quantity}</td>
        <td style="padding:10px;border:1px solid #ddd;">₹${item.price}</td>
      </tr>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Order Confirmation</title>
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="650" style="background:white;margin:30px auto;border-radius:10px;overflow:hidden;">

<tr>
<td style="background:#111827;padding:25px;text-align:center;color:white;">
<h1>🛍 ShopNest</h1>
<p>Order Confirmation</p>
</td>
</tr>

<tr>
<td style="padding:30px;">

<h2>Hello ${customerName}, 👋</h2>

<p>
Thank you for shopping with <b>ShopNest</b>.
Your order has been placed successfully.
</p>

<hr>

<h3>Order Details</h3>

<p><b>Order ID:</b> ${orderId}</p>

<p><b>Payment ID:</b> ${paymentId}</p>

<p><b>Total Amount:</b> ₹${totalAmount}</p>

<p><b>Status:</b> Pending</p>

<hr>

<h3>Shipping Address</h3>

<p>
  <strong>${address.fullName}</strong><br>
  ${address.Street}<br>
  ${address.city}, ${address.postalCode}<br>
  ${address.country}
</p>

<hr>

<h3>Ordered Items</h3>

<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
<tr style="background:#2563eb;color:white;">
<th style="padding:10px;border:1px solid #ddd;">#</th>
<th style="padding:10px;border:1px solid #ddd;">Product</th>
<th style="padding:10px;border:1px solid #ddd;">Qty</th>
<th style="padding:10px;border:1px solid #ddd;">Price</th>
</tr>

${itemRows}

</table>

<div style="margin-top:35px;text-align:center;">
<a href="https://yourfrontend.com/orders"
style="
background:#2563eb;
color:white;
padding:15px 35px;
text-decoration:none;
border-radius:8px;
font-weight:bold;">
Track Your Order
</a>
</div>

<p style="margin-top:35px;">
Thank you for choosing ShopNest ❤️
</p>

</td>
</tr>

<tr>
<td style="background:#111827;color:white;text-align:center;padding:20px;">
© ${new Date().getFullYear()} ShopNest
<br>
Happy Shopping 🚀
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};

module.exports = orderSuccessTemplate;