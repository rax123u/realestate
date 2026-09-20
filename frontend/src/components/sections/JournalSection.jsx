import OptimizedImage from '../ui/OptimizedImage';
import SectionHeader from '../ui/SectionHeader';

const STORIES = [
  {
    title: 'Proportion before ornament',
    kicker: 'Essay',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400&q=80',
    text: 'The residences we represent are chosen for plan, light, and the way a room meets a garden — not for spectacle.',
  },
  {
    title: 'A quieter kind of luxury',
    kicker: 'Notes',
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80',
    text: 'Materials that age. Kitchens that work. Thresholds that feel inevitable.',
  },
  {
    title: 'Buying with an architect’s eye',
    kicker: 'Guide',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
    text: 'Orientation, structure, and neighbourhood cadence — the questions that matter before the finish list.',
  },
];

export default function JournalSection() {
  return (
    <section id="journal" className="section-space" style={{ background: 'var(--color-white)' }}>
      <div className="site-wrap">
        <SectionHeader eyebrow="Journal" title="An editorial on living well." />
        <div className="journal-grid">
          {STORIES.map((story) => (
            <article key={story.title} className="journal-card">
              <OptimizedImage src={story.image} alt={story.title} width={900} sizes="(max-width: 768px) 100vw, 33vw" />
              <p className="eyebrow">{story.kicker}</p>
              <h3>{story.title}</h3>
              <p className="lede" style={{ fontSize: '1rem' }}>{story.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
