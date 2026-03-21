import axios from "../Protected/axios";
import axiosPublic from "../Protected/axiosPublic";

// Get all heroes
export const getAllHeroes = async () => {
  try {
    const response = await axiosPublic.get("/api/heroes");
    return response.data;
  } catch (error) {
    console.error('Error fetching heroes:', error);
    throw error;
  }
};

// Get active hero (for backward compatibility)
export const getHeroData = async () => {
  try {
    const response = await axiosPublic.get("/api/heroes/active");
    return response.data;
  } catch (error) {
    console.error('Error fetching active hero:', error);
    throw error;
  }
};

// Get hero by page/identifier
export const getHeroByPage = async (pageName) => {
  try {
    const response = await axiosPublic.get(`/api/heroes/page/${pageName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching hero for page ${pageName}:`, error);
    throw error;
  }
};

// Get hero by ID
export const getHeroById = async (id) => {
  try {
    const response = await axiosPublic.get(`/api/heroes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hero:', error);
    throw error;
  }
};

// Create hero
export const createHero = async (heroData) => {
  try {
    // Ensure all fields are properly formatted
    const formattedData = {
      mainHeading: heroData.mainHeading || "We Grow Brands",
      highlightedText: heroData.highlightedText || "Globally",
      texts: Array.isArray(heroData.texts) ? heroData.texts.filter(t => t && t.trim() !== "") : ["Welcome"],
      buttons: Array.isArray(heroData.buttons) ? heroData.buttons.filter(b => b.text && b.link) : [],
      stats: Array.isArray(heroData.stats) ? heroData.stats.filter(s => s.value && s.label) : [],
      page: heroData.page || "home",
      isActive: heroData.isActive || false
    };

    const response = await axios.post("/api/heroes", formattedData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating hero:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
    throw error;
  }
};

// Update hero
export const updateHero = async (id, heroData) => {
  try {
    const formattedData = {
      mainHeading: heroData.mainHeading,
      highlightedText: heroData.highlightedText,
      texts: Array.isArray(heroData.texts) ? heroData.texts.filter(t => t && t.trim() !== "") : ["Welcome"],
      buttons: Array.isArray(heroData.buttons) ? heroData.buttons.filter(b => b.text && b.link) : [],
      stats: Array.isArray(heroData.stats) ? heroData.stats.filter(s => s.value && s.label) : [],
      page: heroData.page,
      isActive: heroData.isActive
    };

    const response = await axios.put(`/api/heroes/${id}`, formattedData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating hero:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
    throw error;
  }
};

// Delete hero
export const deleteHero = async (id) => {
  try {
    const response = await axios.delete(`/api/heroes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting hero:', error);
    throw error;
  }
};

// Upload slides
export const uploadSlides = async (id, files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('slides', file));
  
  try {
    const response = await axios.post(`/api/heroes/${id}/slides`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading slides:', error);
    throw error;
  }
};

// Delete slide
export const deleteSlide = async (heroId, slideId) => {
  try {
    const response = await axios.delete(`/api/heroes/${heroId}/slides/${slideId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting slide:', error);
    throw error;
  }
};