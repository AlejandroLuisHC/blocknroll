import Hero from "../components/Hero";
import Services from "../components/Services";
import About from "../components/About";
import Gallery from "../components/Gallery";
import Contact from "../components/Contact";
import LeagueRibbon from "../components/LeagueRibbon";
import { useClubSeason } from "../hooks/useClubSeason";
import { useContactForm } from "../hooks/useContactForm";

const HomePage = () => {
  const form = useContactForm();
  const season = useClubSeason();

  return (
    <>
      <Hero onTrial={() => form.selectTraining()} season={season} />
      <About />
      <LeagueRibbon />
      <Gallery />
      <Services onSelectTraining={form.selectTraining} season={season} />
      <Contact form={form} />
    </>
  );
};

export default HomePage;
