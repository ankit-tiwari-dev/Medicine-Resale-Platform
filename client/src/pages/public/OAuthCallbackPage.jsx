import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { storage } from "../../utils/storage";

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const sync = async () => {
      try {
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");

        if (accessToken) storage.setAccessToken(accessToken);
        if (refreshToken) storage.setRefreshToken(refreshToken);

        // This will update the AuthContext state
        await refreshUser();

        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("OAuth Sync Error:", err);
        navigate("/login", { replace: true });
      }
    };
    sync();
  }, [navigate, searchParams, refreshUser]);

  return <div className="page-wrap text-sm text-textSecondary">Completing secure sign-in...</div>;
};

export default OAuthCallbackPage;
