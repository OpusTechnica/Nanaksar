with open("src/data/restaurantData.ts", "r", encoding="utf-8") as f:
    text = f.read()

# Fix any dash replacements in restaurantData.ts
text = text.replace("17•19", "17-19")
text = text.replace("11:00 AM • 11:30 PM", "11:00 AM - 11:30 PM")
text = text.replace("12:30 PM • 3:30 PM", "12:30 PM - 3:30 PM")
text = text.replace("7:30 PM • 11:30 PM", "7:30 PM - 11:30 PM")

with open("src/data/restaurantData.ts", "w", encoding="utf-8") as f:
    f.write(text)

print("Cleaned restaurantData.ts")
