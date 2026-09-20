const PHRASE = ['Architecture', 'Residence', 'Light', 'Material', 'Place', 'Quiet luxury'];

function PhraseGroup() {
  return (
    <div className="marquee-group" aria-hidden="true">
      {PHRASE.map((word) => (
        <span key={word}>{word} —</span>
      ))}
    </div>
  );
}

export default function HorizontalType() {
  return (
    <section className="marquee-section" aria-label="Aurelius principles">
      <p className="sr-only">{PHRASE.join(', ')}</p>
      <div className="marquee-mask">
        <div className="marquee-track">
          <PhraseGroup />
          <PhraseGroup />
        </div>
      </div>
    </section>
  );
}
