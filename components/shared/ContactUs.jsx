"use client";

import { useState } from "react";
import { Button } from "../ui/button";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., send data to the backend
    // console.log("Form Submitted", formData);
    setFormData({
      email: "",
      message: "",
    });
  };

  return (
    <section id="contact-us" className="py-24 mt-24">
      <div className="flex flex-col gap-8 items-center">
        <p className='font-bold text-center text-4xl md:text-5xl'>Contact Us</p>
        <p className='max-w-3xl text-center text-base md:text-xl font-semibold text-stone-primary'>
          Have any questions or inquiries? Feel free to reach out!
        </p>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="max-w-lg w-full mt-8 mx-auto bg-accent p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-semibold mb-2 text-stone-secondary">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border-2 border-border rounded-lg focus:outline-offset-0 focus:outline-none focus:outline-2 focus:outline-ring"
              placeholder="Your email address"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-lg font-semibold mb-2 text-stone-secondary">
              Your Enquiry
            </label>
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border-2 border-border rounded-lg focus:outline-offset-0 focus:outline-none focus:outline-2 focus:outline-ring"
              rows="5"
              placeholder="Write your message here"
              required
            ></textarea>
          </div>
          <div className="text-center">
            <Button className="hover:bg-primary-hover rounded-lg w-full">
              Send
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;