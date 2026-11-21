"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuCircleAlert, LuPlus, LuUpload, LuX } from "react-icons/lu";
import { apiRequest } from "@/app/lib/client-api";
import { AMENITY_OPTIONS, CATEGORIES } from "@/app/lib/constants";
import StudioImage from "@/components/ui/StudioImage";

const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

// One form for both "Add New Studio" and "Update Studio"
export default function StudioForm({ mode, studio, host }) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    title: studio?.title || "",
    category: studio?.category || "",
    hourlyRate: studio?.hourlyRate ?? "",
    securityDeposit: studio?.securityDeposit ?? "",
    maxCapacity: studio?.maxCapacity ?? "",
    location: studio?.location || "",
    image: studio?.image || "",
    galleryText: (studio?.gallery || []).join("\n"),
    overview: studio?.overview || "",
  });
  const [amenities, setAmenities] = useState(studio?.amenities || []);
  const [customAmenity, setCustomAmenity] = useState("");
  const [formError, setFormError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Every amenity ever ticked or typed stays visible as a checkbox
  const amenityList = [...new Set([...AMENITY_OPTIONS, ...amenities])];

  const toggleAmenity = (name) =>
    setAmenities((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    );

  const addCustomAmenity = () => {
    const name = customAmenity.trim();
    if (!name) return;
    if (name.length > 40) return toast.error("Keep each amenity under 40 characters.");
    setAmenities((current) => (current.includes(name) ? current : [...current, name]));
    setCustomAmenity("");
  };

  // Upload a photo to ImgBB and use the link it gives back
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) return toast.error("Images must be 5 MB or smaller.");

    setUploading(true);
    try {
      const body = new FormData();
      body.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
        method: "POST",
        body,
      });
      const json = await res.json();
      if (!res.ok || !json?.data?.url) {
        throw new Error(json?.error?.message || "Upload failed.");
      }
      setForm((current) => ({ ...current, image: json.data.url }));
      toast.success("Photo uploaded!");
    } catch (error) {
      toast.error(error.message || "Photo upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.category) return setFormError("Please choose a category.");
    if (amenities.length === 0) return setFormError("Please select at least one amenity.");

    const payload = {
      title: form.title,
      category: form.category,
      hourlyRate: Number(form.hourlyRate),
      securityDeposit: Number(form.securityDeposit),
      maxCapacity: Number(form.maxCapacity),
      location: form.location,
      image: form.image,
      gallery: form.galleryText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      amenities,
      overview: form.overview,
    };

    setLoading(true);
    const res = await apiRequest(isEdit ? `/studios/${studio._id}` : "/studios", {
      method: isEdit ? "PATCH" : "POST",
      body: payload,
    });
    setLoading(false);

    if (!res.ok) {
      setFormError(res.message);
      toast.error(res.message);
      return;
    }

    toast.success(isEdit ? "Studio updated successfully!" : "Your studio is live!");
    router.push("/my-listings");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-box border border-base-300 bg-base-100 p-6 shadow-sm md:p-8"
    >
      {formError && (
        <div role="alert" className="alert alert-error alert-soft text-sm">
          <LuCircleAlert size={18} />
          <span>{formError}</span>
        </div>
      )}

      {/* Basics */}
      <div className="grid gap-5 md:grid-cols-2">
        <fieldset className="fieldset md:col-span-2">
          <legend className="fieldset-legend">Studio title</legend>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={80}
            placeholder="Example: Northlight Daylight Studio"
            className="input w-full"
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Category</legend>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="select w-full"
          >
            <option value="" disabled>
              Choose a category
            </option>
            {CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.value}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Max capacity (people)</legend>
          <input
            type="number"
            name="maxCapacity"
            value={form.maxCapacity}
            onChange={handleChange}
            required
            min={1}
            step={1}
            placeholder="8"
            className="input w-full"
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Hourly rate ($)</legend>
          <input
            type="number"
            name="hourlyRate"
            value={form.hourlyRate}
            onChange={handleChange}
            required
            min={1}
            step="any"
            placeholder="40"
            className="input w-full"
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Security deposit ($)</legend>
          <input
            type="number"
            name="securityDeposit"
            value={form.securityDeposit}
            onChange={handleChange}
            required
            min={0}
            step="any"
            placeholder="100"
            className="input w-full"
          />
        </fieldset>

        <fieldset className="fieldset md:col-span-2">
          <legend className="fieldset-legend">Location / address</legend>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            minLength={5}
            maxLength={150}
            placeholder="House 12, Road 5, Banani, Dhaka"
            className="input w-full"
          />
        </fieldset>
      </div>

      {/* Photos */}
      <div className="space-y-4">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Main image URL</legend>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              required
              placeholder="https://i.ibb.co/your-studio-photo.jpg"
              className="input w-full"
            />
            <label
              className={`btn btn-outline shrink-0 ${
                uploading || !IMGBB_KEY ? "btn-disabled" : ""
              }`}
              title={
                IMGBB_KEY
                  ? undefined
                  : "Set NEXT_PUBLIC_IMGBB_API_KEY in .env.local to enable uploads."
              }
            >
              {uploading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <LuUpload size={18} />
              )}
              Upload photo
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading || !IMGBB_KEY}
                className="hidden"
              />
            </label>
          </div>
          {!IMGBB_KEY && (
            <p className="text-xs text-warning">
              Image uploads are disabled until NEXT_PUBLIC_IMGBB_API_KEY is set.
              You can still enter an image URL.
            </p>
          )}
          {form.image && (
            <div className="mt-3 aspect-[16/9] max-w-xs overflow-hidden rounded-box border border-base-300">
              <StudioImage
                key={form.image}
                src={form.image}
                alt="Main studio preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Extra gallery images (optional, one URL per line, up to 6)</legend>
          <textarea
            name="galleryText"
            value={form.galleryText}
            onChange={handleChange}
            rows={3}
            placeholder={"https://i.ibb.co/photo-two.jpg\nhttps://i.ibb.co/photo-three.jpg"}
            className="textarea w-full"
          />
        </fieldset>
      </div>

      {/* Amenities */}
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Amenities</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {amenityList.map((name) => (
            <label
              key={name}
              className={`flex cursor-pointer items-center gap-2 rounded-field border px-3 py-2 text-sm transition ${
                amenities.includes(name)
                  ? "border-primary bg-primary/10"
                  : "border-base-300 hover:border-primary/50"
              }`}
            >
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={amenities.includes(name)}
                onChange={() => toggleAmenity(name)}
              />
              {name}
            </label>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomAmenity();
              }
            }}
            placeholder="Add your own amenity"
            className="input w-full"
          />
          <button type="button" onClick={addCustomAmenity} className="btn btn-outline shrink-0">
            <LuPlus size={18} />
            Add
          </button>
        </div>
        {amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {amenities.map((name) => (
              <span key={name} className="badge badge-primary badge-soft gap-1 py-3">
                {name}
                <button
                  type="button"
                  onClick={() => toggleAmenity(name)}
                  aria-label={`Remove ${name}`}
                >
                  <LuX size={13} />
                </button>
              </span>
            ))}
          </div>
        )}
      </fieldset>

      {/* Overview */}
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Detailed overview</legend>
        <textarea
          name="overview"
          value={form.overview}
          onChange={handleChange}
          required
          minLength={20}
          maxLength={2000}
          rows={6}
          placeholder="Describe the space, the light, the gear that comes with it and what kind of projects it suits."
          className="textarea w-full"
        />
        <p className="mt-1 text-xs text-base-content/60">{form.overview.length} / 2000 characters</p>
      </fieldset>

      {/* Read-only host details */}
      <div className="grid gap-5 md:grid-cols-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Host name</legend>
          <input value={host.name} readOnly className="input w-full cursor-not-allowed bg-base-200" />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Host email</legend>
          <input value={host.email} readOnly className="input w-full cursor-not-allowed bg-base-200" />
        </fieldset>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/my-listings")}
          className="btn"
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading || uploading}>
          {loading && <span className="loading loading-spinner loading-sm" />}
          {isEdit ? "Save Changes" : "Publish Studio"}
        </button>
      </div>
    </form>
  );
}
