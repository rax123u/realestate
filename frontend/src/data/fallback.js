export const MEDIA = {
 heroVideo:
'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  heroPoster:
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
  properties: [
    {
      id: 1,
      title: 'The Azure Penthouse',
      location: 'Manhattan, New York',
      price: 12500000,
      bedrooms: 4,
      bathrooms: 5,
      area: 5200,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
      video: 'https://assets.mixkit.co/videos/44370/44370-360.mp4',
      featured: true,
      showcase: true,
    },
    {
      id: 2,
      title: 'Villa Serenity',
      location: 'Malibu, California',
      price: 18900000,
      bedrooms: 6,
      bathrooms: 7,
      area: 8400,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      video: 'https://videos.pexels.com/video-files/2711270/2711270-uhd_2560_1440_25fps.mp4',
      featured: true,
      showcase: true,
    },
    {
      id: 3,
      title: 'The Obsidian Estate',
      location: 'Aspen, Colorado',
      price: 24750000,
      bedrooms: 8,
      bathrooms: 9,
      area: 12000,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      video: 'https://videos.pexels.com/video-files/3121264/3121264-uhd_2560_1440_25fps.mp4',
      featured: true,
      showcase: true,
    },
    
    {
      id: 5,
      title: 'The Kensington Manor',
      location: 'London, United Kingdom',
      price: 31200000,
      bedrooms: 7,
      bathrooms: 8,
      area: 9800,
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f84d4fa67?w=1200&q=80',
      featured: true,
      showcase: true,
    },
    {
      id: 6,
      title: 'Desert Mirage',
      location: 'Scottsdale, Arizona',
      price: 7200000,
      bedrooms: 4,
      bathrooms: 5,
      area: 4800,
      image: 'https://images.unsplash.com/photo-1600566753190-17f17baa2f2f?w=1200&q=80',
      featured: false,
      showcase: false,
    },
  ],
  storytelling: [
    {
      text: 'WHERE DESIGN MEETS LUXURY',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80',
    },
    {
      text: 'FIND YOUR PERFECT SPACE',
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1920&q=80',
    },
    {
      text: 'LIVE BEYOND EXPECTATIONS',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80',
    },
  ],
  testimonials: [
    {
      id: 1,
      name: 'Victoria Ashford',
      role: 'CEO, Ashford Holdings',
      quote:
        'Aurelius transformed our property search into an experience of pure elegance. Their attention to detail is unmatched in the luxury market.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    },
    {
      id: 2,
      name: 'Marcus Chen',
      role: 'Tech Entrepreneur',
      quote:
        'From the first viewing to closing, every interaction felt bespoke and refined. This is how luxury real estate should be done.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      role: 'Art Collector',
      quote:
        'The properties they curate are architectural masterpieces. Aurelius doesn\'t just sell homes — they deliver lifestyles.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    },
  ],
  agent: {
    name: 'Muhammad Rayyan',
    title: 'Senior Luxury Advisor',
    phone: '+92-3189524077',
    email: 'rayyanmuhammad224@gmail.com',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
  },
};

export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}
