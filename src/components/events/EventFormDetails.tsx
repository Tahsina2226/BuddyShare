"use client";

import { useState } from "react";
import {
  EventFormData,
  EVENT_TYPES,
  EVENT_CATEGORIES,
} from "@/types/eventForm";
import {
  Sparkles,
  Trophy,
  Tag,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  X,
  Plus,
} from "lucide-react";
import { showFancyAlert } from "./EventFormHelpers";

interface EventFormDetailsProps {
  formData: EventFormData;
  onFormChange: (data: Partial<EventFormData>) => void;
}

export default function EventFormDetails({
  formData,
  onFormChange,
}: EventFormDetailsProps) {
  const [tagInput, setTagInput] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    onFormChange({
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      onFormChange({ tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
      showFancyAlert(`🎯 Tag "${tagInput.trim()}" added`, "success", 2000);
    } else if (formData.tags.includes(tagInput.trim())) {
      showFancyAlert("Tag already exists", "warning", 2000);
    }
  };

  const handleTagRemove = (tag: string) => {
    onFormChange({ tags: formData.tags.filter((t) => t !== tag) });
    showFancyAlert(`🗑️ Tag "${tag}" removed`, "info", 2000);
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTagAdd();
    }
  };

  return (
    <>
      <BasicInformationSection
        formData={formData}
        handleChange={handleChange}
      />
      <EventDetailsSection formData={formData} handleChange={handleChange} />
      <TagsSection
        tagInput={tagInput}
        setTagInput={setTagInput}
        tags={formData.tags}
        onTagAdd={handleTagAdd}
        onTagRemove={handleTagRemove}
        onTagKeyPress={handleTagKeyPress}
      />
    </>
  );
}

const BasicInformationSection = ({
  formData,
  handleChange,
}: {
  formData: EventFormData;
  handleChange: (e: any) => void;
}) => (
  <div>
    <div className="flex items-center gap-3 mb-6 pb-2 border-white/10 border-b">
      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-2 rounded-lg">
        <Sparkles className="w-5 h-5 text-cyan-300" />
      </div>
      <h2 className="font-bold text-white text-xl">Basic Information</h2>
    </div>
    <div className="space-y-6">
      <div>
        <label className="block mb-2 font-medium text-white/80 text-sm">
          Event Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Weekend Hiking Trip"
          className="bg-white/10 px-4 py-3 border border-white/20 focus:border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-full text-white placeholder-white/50"
          required
          maxLength={100}
        />
        <p className="mt-1 text-white/60 text-sm">
          Make it catchy and descriptive ({formData.title.length}/100)
        </p>
      </div>

      <div>
        <label className="block mb-2 font-medium text-white/80 text-sm">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your event in detail..."
          rows={4}
          className="bg-white/10 px-4 py-3 border border-white/20 focus:border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-full text-white placeholder-white/50"
          required
          maxLength={1000}
        />
        <p className="mt-1 text-white/60 text-sm">
          {formData.description.length}/1000 characters
        </p>
      </div>
    </div>
  </div>
);

const EventDetailsSection = ({
  formData,
  handleChange,
}: {
  formData: EventFormData;
  handleChange: (e: any) => void;
}) => (
  <div>
    <div className="flex items-center gap-3 mb-6 pb-2 border-white/10 border-b">
      <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 p-2 rounded-lg">
        <Trophy className="w-5 h-5 text-emerald-300" />
      </div>
      <h2 className="font-bold text-white text-xl">Event Details</h2>
    </div>
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
      <div>
        <label className="block mb-2 font-medium text-white/80 text-sm">
          Event Type *
        </label>
        <select
          name="eventType"
          value={formData.eventType}
          onChange={handleChange}
          className="bg-white/10 px-4 py-3 border border-white/20 focus:border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-full text-white"
        >
          {EVENT_TYPES.map((type) => (
            <option
              key={type.value}
              value={type.value}
              className="bg-[#152a3d] text-white"
            >
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium text-white/80 text-sm">
          Category *
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="bg-white/10 px-4 py-3 border border-white/20 focus:border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-full text-white"
        >
          {EVENT_CATEGORIES.map((category) => (
            <option
              key={category}
              value={category}
              className="bg-[#152a3d] text-white"
            >
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4 md:col-span-2">
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          <div>
            <label className="block mb-2 font-medium text-white/80 text-sm">
              <Calendar className="inline mr-1 w-4 h-4" /> Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="bg-white/10 px-4 py-3 border border-white/20 focus:border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-full text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-white/80 text-sm">
              <Clock className="inline mr-1 w-4 h-4" /> Time *
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="bg-white/10 px-4 py-3 border border-white/20 focus:border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-full text-white"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 md:col-span-2">
        <div>
          <label className="block mb-2 font-medium text-white/80 text-sm">
            <MapPin className="inline mr-1 w-4 h-4" /> Location (City/Area) *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Dhaka, Gulshan"
            className="bg-white/10 px-4 py-3 border border-white/20 focus:border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-full text-white placeholder-white/50"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-white/80 text-sm">
            Full Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g., 123 Main Street, Gulshan-1"
            className="bg-white/10 px-4 py-3 border border-white/20 focus:border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-full text-white placeholder-white/50"
            required
          />
        </div>
      </div>

      <div className="space-y-4 md:col-span-2">
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          <div>
            <label className="block mb-2 font-medium text-white/80 text-sm">
              <Users className="inline mr-1 w-4 h-4" /> Maximum Participants *
            </label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              min="1"
              max="1000"
              className="bg-white/10 px-4 py-3 border border-white/20 focus:border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-full text-white"
              required
            />
            <p className="mt-1 text-white/60 text-sm">
              How many people can join? (1-1000)
            </p>
          </div>

          <div>
            <label className="block mb-2 font-medium text-white/80 text-sm">
              <DollarSign className="inline mr-1 w-4 h-4" /> Joining Fee (USD)
            </label>
            <input
              type="number"
              name="joiningFee"
              value={formData.joiningFee}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0 for free event"
              className="bg-white/10 px-4 py-3 border border-white/20 focus:border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-full text-white placeholder-white/50"
            />
            <p className="mt-1 text-white/60 text-sm">
              Enter 0 for free events
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TagsSection = ({
  tagInput,
  setTagInput,
  tags,
  onTagAdd,
  onTagRemove,
  onTagKeyPress,
}: {
  tagInput: string;
  setTagInput: (value: string) => void;
  tags: string[];
  onTagAdd: () => void;
  onTagRemove: (tag: string) => void;
  onTagKeyPress: (e: React.KeyboardEvent) => void;
}) => (
  <div>
    <div className="flex items-center gap-3 mb-6 pb-2 border-white/10 border-b">
      <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 p-2 rounded-lg">
        <Tag className="w-5 h-5 text-purple-300" />
      </div>
      <h2 className="font-bold text-white text-xl">Tags</h2>
    </div>
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={onTagKeyPress}
          placeholder="Add a tag (e.g., beginners-friendly)"
          className="flex-1 bg-white/10 px-4 py-3 border border-white/20 focus:border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-white/50"
        />
        <button
          type="button"
          onClick={onTagAdd}
          className="flex items-center bg-gradient-to-r from-cyan-500/20 hover:from-cyan-500/30 to-blue-500/20 hover:to-blue-500/30 px-4 py-3 border border-cyan-500/30 hover:border-cyan-500/50 rounded-xl text-white transition-all"
        >
          <Plus className="mr-1 w-5 h-5" /> Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-3 py-1 border border-cyan-500/30 rounded-full text-white hover:scale-105 transition-transform"
          >
            #{tag}
            <button
              type="button"
              onClick={() => onTagRemove(tag)}
              className="ml-2 hover:text-cyan-300 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {tags.length === 0 && (
          <p className="text-white/50 italic">
            No tags added yet. Add some tags to help people find your event.
          </p>
        )}
      </div>
    </div>
  </div>
);
