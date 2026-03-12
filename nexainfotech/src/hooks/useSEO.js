import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "../Protected/axiosPublic"; // Using public axios to avoid session checks for SEO fetching

const useSEO = () => {
  const location = useLocation();

  useEffect(() => {
    // Skip SEO for admin and dashboard routes
    if (location.pathname.startsWith("/admin") || location.pathname.startsWith("/seo")) {
      return;
    }

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
          let metaDescription = document.querySelector("meta[name='description']") || document.querySelector("meta[name='Description']");
          if (seoData.metaDescription) {
            if (metaDescription) {
              metaDescription.setAttribute("content", seoData.metaDescription);
            } else {
              const meta = document.createElement("meta");
              meta.name = "description";
              meta.content = seoData.metaDescription;
              document.head.appendChild(meta);
            }
          }

          // Update Meta Keywords
          let metaKeywords = document.querySelector("meta[name='keywords']") || document.querySelector("meta[name='Keywords']");
          if (seoData.metaKeywords) {
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
          let robotsMeta = document.querySelector("meta[name='robots']") || document.querySelector("meta[name='Robots']");
          const robotsValue = seoData.robotsTag || "index, follow";
          if (robotsMeta) {
            robotsMeta.setAttribute("content", robotsValue);
          } else {
            const meta = document.createElement("meta");
            meta.name = "robots";
            meta.content = robotsValue;
            document.head.appendChild(meta);
          }

          // Update Canonical URL
          let canonicalLink = document.querySelector("link[rel='canonical']") || document.querySelector("link[rel='Canonical']");
          if (seoData.canonicalUrl && seoData.canonicalUrl.trim()) {
            const canonicalValue = seoData.canonicalUrl.trim();
            if (canonicalLink) {
              canonicalLink.setAttribute("href", canonicalValue);
            } else {
              const link = document.createElement("link");
              link.rel = "canonical";
              link.href = canonicalValue;
              document.head.appendChild(link);
            }
          } else if (canonicalLink) {
            canonicalLink.remove();
          }

          // AUTO-SEO: If SEO data exists but title is generic or missing, and we find an H1, sync it.
          // We wait a bit for the page to render the H1
          setTimeout(async () => {
            const h1Element = document.querySelector("h1");
            if (h1Element && h1Element.innerText.trim()) {
              const h1Text = h1Element.innerText.trim();
              if (!seoData.metaTitle || seoData.metaTitle === "Automatic Title") {
                console.log("🔄 Auto SEO: Syncing Title from H1:", h1Text);
                try {
                  await axios.post("/api/seo/auto-update", {
                    pageUrl: currentPath,
                    metaTitle: h1Text
                  });
                  document.title = h1Text;
                } catch (e) {
                  console.error("❌ Auto SEO Sync Error:", e);
                }
              }
            }
          }, 1000);

        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(`ℹ️ No custom SEO found for ${location.pathname}, attempting Auto SEO...`);
          
          // Try to get H1 and create a new SEO record
          setTimeout(async () => {
            const h1Element = document.querySelector("h1");
            if (h1Element && h1Element.innerText.trim()) {
              const h1Text = h1Element.innerText.trim();
              console.log("✨ Auto SEO: Creating new SEO record from H1:", h1Text);
              try {
                await axios.post("/api/seo/auto-update", {
                  pageUrl: location.pathname,
                  metaTitle: h1Text
                });
                document.title = h1Text;
              } catch (e) {
                console.error("❌ Auto SEO Creation Error:", e);
              }
            }
          }, 1000);

        } else {
          console.error("❌ SEO Update Error:", error);
        }
      }
    };

    updateSEO();
  }, [location.pathname]);
};

export default useSEO;
