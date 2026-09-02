# Fix CartDrawer.tsx
with open("src/components/CartDrawer.tsx", "r", encoding="utf-8") as f:
    cart_code = f.read()

cart_code = cart_code.replace("?{item.price}", "₹{item.price}")
cart_code = cart_code.replace("?{item.price * item.quantity}", "₹{item.price * item.quantity}")
cart_code = cart_code.replace("?{summary.subtotal}", "₹{summary.subtotal}")
cart_code = cart_code.replace("?{summary.packagingTotal}", "₹{summary.packagingTotal}")
cart_code = cart_code.replace("?{summary.gst}", "₹{summary.gst}")
cart_code = cart_code.replace("?{summary.grandTotal}", "₹{summary.grandTotal}")
cart_code = cart_code.replace("17•19", "17-19")

with open("src/components/CartDrawer.tsx", "w", encoding="utf-8") as f:
    f.write(cart_code)

# Fix restaurantData.ts
with open("src/data/restaurantData.ts", "r", encoding="utf-8") as f:
    data_code = f.read()

data_code = data_code.replace("?1", "₹1")
data_code = data_code.replace("?4", "₹4")
data_code = data_code.replace("17•19", "17-19")
data_code = data_code.replace("17?19", "17-19")

with open("src/data/restaurantData.ts", "w", encoding="utf-8") as f:
    f.write(data_code)

print("Fixed CartDrawer.tsx and restaurantData.ts currency symbols")
