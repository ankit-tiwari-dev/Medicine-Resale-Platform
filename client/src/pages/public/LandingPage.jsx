import { useEffect, useState } from "react";
import { getHealthStatus } from "../../api/systemApi";
import { browseMedicines } from "../../api/medicineApi";
import LandingHero from "../../components/landing/LandingHero";
import LandingAboutSection from "../../components/landing/LandingAboutSection";
import FeaturedMedicinesSection from "../../components/landing/FeaturedMedicinesSection";
import LandingTrustSections from "../../components/landing/LandingTrustSections";
import Section from "../../components/layout/Section";
import Container from "../../components/layout/Container";

const LandingPage = () => {
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState(null);
  const [healthError, setHealthError] = useState("");

  const [medicinesLoading, setMedicinesLoading] = useState(true);
  const [medicines, setMedicines] = useState([]);
  const [medicinesError, setMedicinesError] = useState("");

  useEffect(() => {
    const fetchLandingData = async () => {
      setHealthLoading(true);
      setMedicinesLoading(true);
      setHealthError("");
      setMedicinesError("");

      try {
        const [healthResponse, medicinesResponse] = await Promise.all([
          getHealthStatus(),
          browseMedicines({ status: "listed", limit: 8 })
        ]);

        setHealthStatus(healthResponse?.data || null);
        setMedicines(medicinesResponse?.data?.data || []);
      } catch (error) {
        const status = error?.response?.status;
        if (status === 401) {
          setMedicinesError("Session expired. Please sign in again.");
        } else {
          setMedicinesError("Unable to fetch featured medicines at the moment.");
        }

        if (!healthStatus) {
          setHealthError("Health endpoint unavailable");
        }
      } finally {
        setHealthLoading(false);
        setMedicinesLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <Section>
        <Container>
          <LandingHero healthStatus={healthStatus} healthLoading={healthLoading} healthError={healthError} />
        </Container>
      </Section>

      {/* App Purpose - visible for OAuth / policy review */}
      <Section muted>
        <Container>
          <LandingAboutSection />
        </Container>
      </Section>

      {/* Featured Medicines Section */}
      <Section>
        <Container>
          <FeaturedMedicinesSection medicines={medicines} loading={medicinesLoading} error={medicinesError} />
        </Container>
      </Section>

      {/* Trust & Proof Section */}
      <Section text-center>
        <Container>
          <LandingTrustSections />
        </Container>
      </Section>
    </>
  );
};

export default LandingPage;

