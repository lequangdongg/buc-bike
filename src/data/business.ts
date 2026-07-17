export const BUSINESS = {
  name: 'BuckBike',
  legalName: 'BuckBike — Electric Scooter Rental',
  phone: '+84978789133',
  phoneDisplay: '+84 978 789 133',
  whatsapp: 'https://wa.me/84978789133',
  email: 'hello@buckbike.com',
  url: 'https://buckbike.com',
  address: {
    street: '31 - B2 An Thuong 37, Bắc Mỹ An',
    district: 'Ngũ Hành Sơn',
    city: 'Đà Nẵng',
    postalCode: '550000',
    country: 'VN',
  },
  // Coordinates of the actual Google Business pin (place
  // 0x3142170049e821f3:0x12f728d5030a70eb) — drives the JSON-LD geo point.
  geo: { lat: 16.0499088, lng: 108.2434231 },
  hours: { opens: '10:00', closes: '23:00' },
  rating: { value: 5.0, count: 86 },
  maps: 'https://maps.app.goo.gl/4r7hXgFa3zhd7WGD6',
  // Official Google embed for the BuckBike place (pinned by place id, so it
  // always lands on the shop). Prefer this over a q=lat,lng embed, which only
  // drops an anonymous marker at coordinates.
  mapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1396.180943969223!2d108.24342312326391!3d16.049908752877023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142170049e821f3%3A0x12f728d5030a70eb!2zQnVja0Jpa2UgfCBSZW50aW5nIEVsZWN0cmljIFNjb290ZXJzIHwgQ2hvIHRodcOqIHhlIG3DoXkgxJFp4buHbiDEkMOgIE7hurVuZyB8IOenn-eUteWKqOi9piB8IOyghOq4sOyYpO2GoOuwlOydtCDrjIDsl6w!5e1!3m2!1svi!2sus!4v1784295380986!5m2!1svi!2sus',
  socials: {
    facebook: 'https://facebook.com/buckbike',
    instagram: 'https://instagram.com/buckbike',
    x: 'https://x.com/buckbike',
  },
} as const;
