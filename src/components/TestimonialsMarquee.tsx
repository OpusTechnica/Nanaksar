import React from 'react';
import { TestimonialsColumn, type TestimonialItem } from './ui/testimonials-columns-1';

const NANAKSAR_TESTIMONIALS: TestimonialItem[] = [
  {
    text: 'The 24-hour Dal Makhani at Nanaksar is unmatched anywhere in Central India. You can taste the real slow-simmered bhatti smoke and pure desi ghee. Unbelievable taste and generous family portions.',
    name: 'Amit Sharma',
    role: 'Indore Foodie',
    branch: 'Dewas Naka Regular',
    rating: 5,
    initials: 'AS',
  },
  {
    text: 'Hot Chur Chur Naan crushed right in front of you with butter melting over it, paired with Sev Tamatar and Dal Makhani. This is true highway soul brought directly into Vijay Nagar!',
    name: 'Pooja Gupta',
    role: 'Family Dining',
    branch: 'Vijay Nagar',
    rating: 5,
    initials: 'PG',
  },
  {
    text: 'Pure Sewa Bhaav is real here. The staff serves with genuine warmth and care. Outstanding hygienic food, pure desi ghee, and 100% vegetarian. Sudama Nagar outlet is fantastic.',
    name: 'Gurpreet Singh',
    role: 'Loyal Patron',
    branch: 'Sudama Nagar',
    rating: 5,
    initials: 'GS',
  },
  {
    text: 'Late night study sessions or road trips always end at Nanaksar Bhawarkua. The Paneer Bhurji with crispy butter rotis is our comfort food. Authentic flavor that never changes.',
    name: 'Rajesh Khandelwal',
    role: 'Tech Lead & Diner',
    branch: 'Bhawarkua Hub',
    rating: 5,
    initials: 'RK',
  },
  {
    text: 'Sunday family lunch at Geeta Bhawan is a fixed ritual for three generations of our family. The Shahi Paneer and Malwa Kheer taste exactly as pure as my grandmother made.',
    name: 'Simran Kaur',
    role: 'Home Chef',
    branch: 'Geeta Bhawan',
    rating: 5,
    initials: 'SK',
  },
  {
    text: 'I drive between Bhopal and Indore every week. Stopping at the original Dewas Naka dhaba for hot dal and fresh tandoori roti is a tradition going back 15 years. Pure bliss.',
    name: 'Vikramaditya Joshi',
    role: 'Highway Commuter',
    branch: 'AB Road Travel',
    rating: 5,
    initials: 'VJ',
  },
  {
    text: 'As a doctor, food hygiene and ingredient purity matter to me. Knowing Nanaksar uses only pure Shuddh Desi Ghee with zero palm oil or soda makes it our family’s only trusted dhaba.',
    name: 'Dr. Anand Verma',
    role: 'Senior Physician',
    branch: 'Palasia Resident',
    rating: 5,
    initials: 'AV',
  },
  {
    text: 'The Malwa Shahi Kheer and warm Kesar Halwa are out of this world! Creamy, rich with saffron, and packed with dry fruits. The takeaway packaging stays piping hot.',
    name: 'Neha Malviya',
    role: 'Culinary Enthusiast',
    branch: 'Vijay Nagar',
    rating: 5,
    initials: 'NM',
  },
  {
    text: 'From the early 1980s highway days to their modern dining rooms today, Veer Ji’s recipes have stayed 100% true to Punjab and Malwa roots. Best roadside feast in MP.',
    name: 'Harpreet Bhati',
    role: 'Transport Fleet Owner',
    branch: 'Dewas Naka Patron',
    rating: 5,
    initials: 'HB',
  },
];

const firstColumn = NANAKSAR_TESTIMONIALS.slice(0, 3);
const secondColumn = NANAKSAR_TESTIMONIALS.slice(3, 6);
const thirdColumn = NANAKSAR_TESTIMONIALS.slice(6, 9);

export default function TestimonialsMarquee() {
  return (
    <section className="relative py-20 sm:py-28 bg-[#F7F4EB] text-[#0F0F0F] border-t border-[#0F0F0F]/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0F0F0F]/10 bg-white px-4 py-1.5 mb-4 shadow-sm">
            <div className="flex text-[#D01B1B] text-xs tracking-wider">
              ★★★★★
            </div>
            <span className="text-xs font-display font-bold uppercase tracking-wider text-[#0F0F0F]">
              4.5 / 5.0 Rating Across 5,000+ Verified Diners
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold uppercase text-[#0F0F0F] tracking-tight">
            Loved Across Indore
          </h2>
          
          <p className="mt-3 text-sm sm:text-base text-[#0F0F0F]/70 font-sans max-w-xl mx-auto leading-relaxed">
            From early highway travelers on AB Road to multi-generational family feasts today across our 5 Indore dining rooms.
          </p>

          <p className="mt-2 text-[11px] font-mono text-[#E4A834] uppercase tracking-wider font-bold">
            Hover or touch any card to pause and read
          </p>
        </div>

        {/* 3-Column Animated Infinite Looping Marquee with Feathered Top & Bottom Masks */}
        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] max-h-[720px] overflow-hidden">
          {/* Column 1: Visible on all screens */}
          <TestimonialsColumn
            testimonials={firstColumn}
            duration={42}
            className="w-full sm:w-auto"
          />

          {/* Column 2: Visible on tablet (md:) and desktop */}
          <TestimonialsColumn
            testimonials={secondColumn}
            duration={52}
            className="hidden md:block w-auto"
          />

          {/* Column 3: Visible on desktop (lg:) */}
          <TestimonialsColumn
            testimonials={thirdColumn}
            duration={46}
            className="hidden lg:block w-auto"
          />
        </div>

      </div>
    </section>
  );
}
