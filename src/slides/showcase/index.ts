import Slide01Intro from './Slide01Intro';
import Slide02InteractiveChart from './Slide02InteractiveChart';
import Slide03FeatureAdoption from './Slide03FeatureAdoption';
import Slide04Interactive3D from './Slide03Interactive3D';
import Slide05CalendarBooking from './Slide04CalendarBooking';

export const showcaseSlides = [
  { component: Slide01Intro, name: 'Introduction', template: 'title' },
  { component: Slide02InteractiveChart, name: 'Supply & Demand', template: 'chart-focus' },
  { component: Slide03FeatureAdoption, name: 'Feature Adoption', template: 'interactive' },
  { component: Slide04Interactive3D, name: '3D Interactive', template: 'interactive' },
  { component: Slide05CalendarBooking, name: 'Calendar Booking', template: 'interactive' },
];
