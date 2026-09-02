with open("src/components/TableReservationModal.tsx", "r", encoding="utf-8") as f:
    c = f.read()

# Replace any question mark in button or spans with SVG arrow
c = c.replace("<span>→</span>", '<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>')
c = c.replace("<span>?</span>", '<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>')
c = c.replace("3•4", "3-4")
c = c.replace("5•8", "5-8")
c = c.replace("7:30 PM • 9:30 PM", "7:30 PM - 9:30 PM")

with open("src/components/TableReservationModal.tsx", "w", encoding="utf-8") as f:
    f.write(c)

print("Updated TableReservationModal.tsx")
