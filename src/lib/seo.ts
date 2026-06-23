import { BUSINESS } from '../data/business';
import { BIKES } from '../data/fleet';
import { PRICING } from '../data/pricing';

export function buildLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BUSINESS.url}/#business`,
    name: BUSINESS.legalName,
    image: `${BUSINESS.url}/og/default.png`,
    telephone: BUSINESS.phoneDisplay,
    url: BUSINESS.url,
    priceRange: '₫₫',
    currenciesAccepted: 'VND',
    paymentAccepted: 'Cash, Bank transfer',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.district,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.lat,
      longitude: BUSINESS.geo.lng,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: BUSINESS.hours.opens,
      closes: BUSINESS.hours.closes,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: BUSINESS.rating.value,
      reviewCount: BUSINESS.rating.count,
    },
    sameAs: [BUSINESS.socials.facebook, BUSINESS.socials.instagram, BUSINESS.socials.x],
  };
}

export function buildProductsJsonLd() {
  return BIKES.map((bike) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: bike.name,
    brand: { '@type': 'Brand', name: bike.brand },
    category: 'Electric scooter rental',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'VND',
      price: PRICING[bike.id].daily,
      availability: bike.available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  }));
}
