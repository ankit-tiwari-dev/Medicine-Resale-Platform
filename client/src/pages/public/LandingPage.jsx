import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHealthStatus } from "../../api/systemApi";
import { browseMedicines } from "../../api/medicineApi";
import LandingHero from "../../components/landing/LandingHero";
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

      {/* Featured Medicines Section - Muted Layer */}
      <Section muted>
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

      {/* Legal Links */}
      <Section muted className="py-10 lg:py-12">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Legal
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/terms"
                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <span className="text-border">|</span>
              <Link
                to="/privacy"
                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};

export default LandingPage;

