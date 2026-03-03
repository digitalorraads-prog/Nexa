import { useState } from "react";

export default function TitleLinkForm() {
  const [formData, setFormData] = useState({
    title: "",
    link: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // API call ya backend save logic ithe laga sakde ho
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add Title & Link
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Link Field */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Link
            </label>
            <input
              type="url"
              name="link"
              placeholder="https://example.com"
              value={formData.link}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
