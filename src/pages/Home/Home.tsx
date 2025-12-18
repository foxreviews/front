import Hero from "./Hero";
import PlaceListing from "./PlaceListing";
import PopularCategories from "./PopularCategories";
import PopularListing from "./PopularListing";
import SponsorshipCTA from "./SponsorshipCTA";
import StatsSection from "./StatsSection";
import Testimonials from "./Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <PopularListing />
      <PopularCategories />
      <PlaceListing />
      <StatsSection/>
      <Testimonials/>
      <SponsorshipCTA/>
    </>
  );
}
