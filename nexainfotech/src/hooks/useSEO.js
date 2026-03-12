import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "../Protected/axiosPublic"; // Using public axios to avoid session checks for SEO fetching

const useSEO = () => {
  const location = useLocation();

  useEffect(() => {
    const updateSEO = async () => {
      try {
        // Encode the pathname to handle special characters in URLs correctly
        const currentPath = location.pathname;
        const encodedPath = encodeURIComponent(currentPath);
        
        const response = await axios.get(`/api/seo/${encodedPath}`);
        const seoData = response.data;
        
        console.log(`🔍 SEO Data for ${currentPath}:`, seoData);

        if (seoData) {
          // Update Document Title
          if (seoData.metaTitle) {
            document.title = seoData.metaTitle;
          }

          // Update Meta Description
          let metaDescription = document.querySelector("meta[name='description']");
          if (seoData.metaDescription) {
            if (metaDescription) {
              metaDescription.setAttribute("content", seoData.metaDescription);
            } else {
              const meta = document.createElement("meta");
              meta.name = "description";
              meta.content = seoData.metaDescription;
              document.head.prepend(meta);
            }
          }

          // Update Meta Keywords
          if (seoData.metaKeywords) {
            let metaKeywords = document.querySelector("meta[name='keywords']");
            if (metaKeywords) {
              metaKeywords.setAttribute("content", seoData.metaKeywords);
            } else {
              const meta = document.createElement("meta");
              meta.name = "keywords";
              meta.content = seoData.metaKeywords;
              document.head.appendChild(meta);
            }
          }

          // Update Robots Tag
          let robotsMeta = document.querySelector("meta[name='robots']");
          const robotsValue = seoData.robotsTag || "index, follow";
          console.log(`🤖 Robots Tag:`, robotsValue);
          if (robotsMeta) {
            robotsMeta.setAttribute("content", robotsValue);
          } else {
            const meta = document.createElement("meta");
            meta.name = "robots";
            meta.content = robotsValue;
            document.head.prepend(meta);
          }

          // Update Canonical URL
          let canonicalLink = document.querySelector("link[rel='canonical']");
          if (seoData.canonicalUrl && seoData.canonicalUrl.trim()) {
            const canonicalValue = seoData.canonicalUrl.trim();
            console.log(`🔗 Canonical URL:`, canonicalValue);
            if (canonicalLink) {
              canonicalLink.setAttribute("href", canonicalValue);
            } else {
              const link = document.createElement("link");
              link.rel = "canonical";
              link.href = canonicalValue;
              document.head.prepend(link);
            }
          } else {
            console.log(`🔗 No Canonical URL defined for this page.`);
            if (canonicalLink) {
              canonicalLink.remove();
            }
          }
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(`ℹ️ No custom SEO found for ${location.pathname}, using defaults.`);
        } else {
          console.error("❌ SEO Update Error:", error);
        }
      }
    };

    updateSEO();
  }, [location.pathname]);
};

export default useSEO;
