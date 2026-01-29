import Slide01Intro from './Slide01Intro';
import Slide02InteractiveChart from './Slide02InteractiveChart';
import Slide03CursorSimulation from './Slide03CursorSimulation';
import Slide04CalendarBooking from './Slide04CalendarBooking';
import Slide05Heatmap from './Slide05Heatmap';

export const showcaseSlides = [
  { component: Slide01Intro, name: 'Introduction', template: 'title' },
  { component: Slide02InteractiveChart, name: 'Interactive Chart', template: 'chart-focus' },
  { component: Slide03CursorSimulation, name: 'Cursor Simulation', template: 'interactive' },
  { component: Slide04CalendarBooking, name: 'Calendar Booking', template: 'interactive' },
  { component: Slide05Heatmap, name: 'Heatmap', template: 'data-story' },
];
