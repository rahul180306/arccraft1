import HeroText from './HeroText';
import HeroButtons from './HeroButtons';
import FeatureIcons from './FeatureIcons';
import HeroDashboard from '../dashboard/HeroDashboard';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen pt-32 pb-16 px-6 md:px-12 max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
      <div className="w-full lg:w-1/2 flex flex-col justify-center">
        <HeroText />
        <HeroButtons />
        <FeatureIcons />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center relative perspective-[1000px]">
        <HeroDashboard />
      </div>
    </section>
  );
}
