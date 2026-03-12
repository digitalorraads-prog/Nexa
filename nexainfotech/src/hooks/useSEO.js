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

        if (seoData) {
          // Update Document Title
          document.title = seoData.metaTitle;

          // Update Meta Description
          let metaDescription = document.querySelector("meta[name='description']");
          if (metaDescription) {
            metaDescription.setAttribute("content", seoData.metaDescription);
          } else {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content = seoData.metaDescription;
            document.head.appendChild(meta);
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
        }
      } catch (error) {
        // If no SEO data is found or any error occurs, we don't change anything
        // This allows default static tags to show up
      }
    };

    updateSEO();
  }, [location.pathname]);
};

export default useSEO;
