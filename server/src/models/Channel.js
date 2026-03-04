const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      maxlength: 80
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300
    }
  },
  { timestamps: true }
);

// Generate/normalize slug server-side (URL-safe)
ChannelSchema.pre("validate", function (next) {
  // If no slug provided, generate from name
  if (!this.slug && this.name) this.slug = this.name;

  if (this.slug) {
    this.slug = this.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .replace(/\s+/g, "-"); // spaces -> hyphens
  }

  next();
});

// Index: Channels unique slug
ChannelSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model("Channel", ChannelSchema);