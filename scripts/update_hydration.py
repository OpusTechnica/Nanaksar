with open("src/pages/index.astro", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("<SignaturesShowcase client:visible />", "<SignaturesShowcase client:load />")
text = text.replace("<BestsellersShowcase client:visible />", "<BestsellersShowcase client:load />")
text = text.replace("<MenuExplorer client:visible />", "<MenuExplorer client:load />")

with open("src/pages/index.astro", "w", encoding="utf-8") as f:
    f.write(text)

print("Updated index.astro with client:load for immediate interactive hydration")
